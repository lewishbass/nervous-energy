'use client';

import { Fragment, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Map as MapGL, Marker, Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Network, Tower, InTransitPacket, distance } from './network';

// a component for illustrating network package routing
// use a mapbox map to display a series of towers and connections
// uses map markers for towers, and polygons for connections

// tower markers are sized based on tower capacity (tower capacity is sum(link capacity * link distance)), and colored green-red based on % load (sum(link load)/sum(link capacity))
// connections display a two dashed lines, side by side representing load, one for each direction, the dash animation speed shows propagation delay, and the line opacity represents capacity (map from 0.1 to 1 based on min and max capacity of supplied towers), line color represents load (green-red based on % load)
// in-transit packets are drawn as small dots that lerp along their link between source and destination, offset to sit over their direction's line

// the Network class (./network.tsx) owns the towers/links/packets simulation; this component
// only reads that data to draw the map and drives the simulation's render loop

function lerp(a: number, b: number, t: number): number {
	// linear interpolation between a and b by t
	return a + (b - a) * t;
}

function ilerp(a: number, b: number, v: number): number {
	// inverse linear interpolation: returns t such that lerp(a, b, t) == v
	return (v - a) / (b - a);
}

function map_range(value: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
	// maps a value from one range to another
	return lerp(out_min, out_max, ilerp(in_min, in_max, value));
}

function clamp01(v: number): number {
	return Math.min(1, Math.max(0, v));
}


// dash pattern length is in units of line-width, so these must stay large relative to
// LINE_WIDTH below or the dashes render imperceptibly small
const LINE_WIDTH = 1.5;
const DASH_LEN = 1;
const GAP_LEN = 1;
// periods-per-second numerator; actual speed = ANIMATION_SPEED_SCALE / propagation_delay
const ANIMATION_SPEED_SCALE = 200;
// how often the network's decision-making onUpdate callback fires
const DEFAULT_TICK_SECONDS = 0.05;
// packet dot diameter, in pixels
const PACKET_DOT_SIZE = 3;

// stacking order for the three visual layers: links are GL layers drawn on the map's canvas so
// they're always beneath HTML markers; these z-indexes order the marker-based layers (packets
// below towers) since packets are imperative mapboxgl.Marker instances added independently of
// the React-managed tower markers
const PACKET_Z_INDEX = 5;
const TOWER_Z_INDEX = 10;

// computes a 'line-dasharray' that represents a dash pattern of length `dash` and
// gap of length `gap` shifted along the line by `shift` (0 <= shift < dash + gap),
// used to animate a marching-ants effect by stepping shift forward each frame
function dashArrayForShift(shift: number, dash: number, gap: number): number[] {
	const period = dash + gap;
	const s = ((shift % period) + period) % period;
	return s <= dash ? [s, gap, dash - s] : [0, s - dash, dash, period - s];
}

// green -> red based on t in [0, 1]
function loadColor(t: number): string {
	const clamped = clamp01(t);
	if(t < 0.5){
		// lerp green to yellow
		const r = Math.round(lerp(0x22, 0xef, clamped * 2));
		const g = Math.round(lerp(0xc5, 0xc5, clamped * 2));
		const b = Math.round(lerp(0x5e, 0x00, clamped * 2));
		return `rgb(${r}, ${g}, ${b})`;

	}else{
		// lerp yellow to red
		const r = Math.round(lerp(0xef, 0xef, clamped));
		const g = Math.round(lerp(0xc5, 0x44, clamped));
		const b = Math.round(lerp(0x00, 0x44, clamped));
	return `rgb(${r}, ${g}, ${b})`;
	}
	
}

function createPacketElement(color: string): HTMLDivElement {
	const el = document.createElement('div');
	el.style.width = `${PACKET_DOT_SIZE}px`;
	el.style.height = `${PACKET_DOT_SIZE}px`;
	el.style.borderRadius = '9999px';
	el.style.backgroundColor = color;
	el.style.pointerEvents = 'none';
	el.style.zIndex = String(PACKET_Z_INDEX);
	return el;
}

// updates (creating/removing as needed) one mapboxgl.Marker per in-transit packet, lerping its
// position between source and destination and offsetting it perpendicular to the travel
// direction so it sits over its direction's dashed line rather than directly on the link
function updatePacketMarkers(
	map: mapboxgl.Map,
	network: Network,
	time: number,
	markers: Map<string, mapboxgl.Marker>
) {
	const active = new Set<string>();

	const place = (item: InTransitPacket, sourcePos: [number, number], destPos: [number, number]) => {
		active.add(item.packet.uuid);
		const span = item.arrival_time - item.departure_time;
		const t = span > 0 ? clamp01((time - item.departure_time) / span) : 1;

		const p0 = map.project(sourcePos);
		const p1 = map.project(destPos);
		const dx = p1.x - p0.x;
		const dy = p1.y - p0.y;
		const len = Math.hypot(dx, dy) || 1;
		// perpendicular to the right of the travel direction, matching the line-offset used by
		// the fwd/rev line layers so the packet stays over its own direction's line
		const perpX = -dy / len;
		const perpY = dx / len;
		const px = lerp(p0.x, p1.x, t) + perpX * LINE_WIDTH;
		const py = lerp(p0.y, p1.y, t) + perpY * LINE_WIDTH;
		const lngLat = map.unproject([px, py]);

		let marker = markers.get(item.packet.uuid);
		if (!marker) {
			marker = new mapboxgl.Marker({ element: createPacketElement(item.packet.color), anchor: 'center' })
				.setLngLat(lngLat)
				.addTo(map);
			markers.set(item.packet.uuid, marker);
		} else {
			marker.setLngLat(lngLat);
		}
	};

	for (const link of Object.values(network.links)) {
		const start = network.towers[link.start_id];
		const end = network.towers[link.end_id];
		if (!start || !end) continue;
		for (const item of link.in_transit_fwd) place(item, start.position, end.position);
		for (const item of link.in_transit_rev) place(item, end.position, start.position);
	}

	for (const [uuid, marker] of markers) {
		if (!active.has(uuid)) {
			marker.remove();
			markers.delete(uuid);
		}
	}
}

export type NetworkToyProps = {
	network: Network;
};

export default function NetworkToy({ network }: NetworkToyProps) {
	const mapRef = useRef<MapRef | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [, setRenderTick] = useState(0);

	const mapStyles: string[] = [
		"mapbox://styles/mapbox/streets-v11",
		"mapbox://styles/mapbox/satellite-v9",
		"mapbox://styles/mapbox/outdoors-v11",
		"mapbox://styles/mapbox/light-v10",
		"mapbox://styles/mapbox/dark-v10",
	];

	const towerList = useMemo(() => Object.values(network.towers), [network]);
	const linkList = useMemo(() => Object.values(network.links), [network]);
	const startAnimationPromise = useRef<ReturnType<typeof setTimeout> | null>(null);
	const packetMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

	// drive the network's decision-making loop for as long as this view is mounted
	useEffect(() => {
		network.start_updating(DEFAULT_TICK_SECONDS);
		return () => network.stop_updating();
	}, [network]);

	// tower/link colors depend on mutable queue/load state the network updates on its own timer,
	// so periodically force a re-render to pick up the latest values
	useEffect(() => {
		const id = setInterval(() => setRenderTick((t) => t + 1), 300);
		return () => clearInterval(id);
	}, []);

	// tower capacity = sum(link capacity * link distance) over its connected links
	const towerCapacity = useCallback((tower: Tower): number => {
		return tower.connected_links.reduce((sum, linkId) => {
			const link = network.links[linkId];
			if (!link) return sum;
			const start = network.towers[link.start_id];
			const end = network.towers[link.end_id];
			if (!start || !end) return sum;
			return sum + (link.capacity_fwd + link.capacity_rev) * distance(start.position, end.position);
		}, 0);
	}, [network]);

	// tower load % = sum(link load) / sum(link capacity) over its connected links
	const towerLoad = useCallback((tower: Tower): number => {
		let load = 0;
		let capacity = 0;
		for (const linkId of tower.connected_links) {
			const link = network.links[linkId];
			if (!link) continue;
			load += link.queue_fwd.length + link.in_transit_fwd.length + link.queue_rev.length + link.in_transit_rev.length;
			capacity += link.capacity_fwd + link.capacity_rev;
		}
		return capacity > 0 ? clamp01(load / capacity) : 0;
	}, [network]);

	const towerCapacities = useMemo(() => towerList.map(towerCapacity), [towerList, towerCapacity]);
	const minTowerCapacity = towerCapacities.length ? Math.min(...towerCapacities) : 0;
	const maxTowerCapacity = towerCapacities.length ? Math.max(...towerCapacities) : 1;

	const linkCapacities = useMemo(() => linkList.flatMap(l => [l.capacity_fwd, l.capacity_rev]).filter(c => c > 0), [linkList]);
	const minLinkCapacity = linkCapacities.length ? Math.min(...linkCapacities) : 0;
	const maxLinkCapacity = linkCapacities.length ? Math.max(...linkCapacities) : 1;

	// per-direction load %, so the forward and reverse lines can each show their own load color
	const linkLoad = useCallback((queue: any[], inTransit: any[], capacity: number): number => {
		return capacity > 0 ? clamp01((queue.length + inTransit.length) / capacity) : 0;
	}, []);

	// fit the map viewport to contain every tower
	const fitToTowers = useCallback(() => {
		const map = mapRef.current;
		if (!map || towerList.length === 0) return;
		const lons = towerList.map(t => t.position[0]);
		const lats = towerList.map(t => t.position[1]);
		const bounds: [[number, number], [number, number]] = [
			[Math.min(...lons), Math.min(...lats)],
			[Math.max(...lons), Math.max(...lats)],
		];
		map.fitBounds(bounds, { padding: 60, duration: 0 });
	}, [towerList]);

	const handleMapLoad = useCallback(() => {
		setMapLoaded(true);
		fitToTowers();
	}, [fitToTowers]);

	// animate the dashed link lines: dash speed reflects each direction's own propagation delay
	// (lower delay = faster marching); forward shift increases while reverse shift decreases so
	// the two lines visibly march toward opposite ends of the link. also drives the network's
	// physics (logic_update) and the in-transit packet dots every frame for smooth motion.
	useEffect(() => {
		if (!mapLoaded) return;
		const map = mapRef.current?.getMap();
		if (!map) return;

		// hide labels
		const layers = map.getStyle().layers ?? [];
		for (const layer of layers) {
			if (layer.type === 'symbol') {
				map.setLayoutProperty(layer.id, 'visibility', 'none');
			}
		}



		let frameId: number;
		let animationStartTime: number = 0;

		const animate = (rafTime: number) => {
			// shared clock for the network's physics and the packet dot interpolation
			network.logic_update(rafTime);

			/* disable line animations due to mapboxgl rendering issues
			// start animation in time
			let time = rafTime - animationStartTime;
			// ramp up
			time = (Math.pow(time, 2)) / (3000+time);

			for (const link of linkList) {
				const fwdSpeed = ANIMATION_SPEED_SCALE / Math.max(1, link.propagation_delay_fwd);
				const revSpeed = ANIMATION_SPEED_SCALE / Math.max(1, link.propagation_delay_rev);
				// both shifts increase; the rev layer's geometry is reversed so it marches the opposite way on screen
				const fwdShift = (time / 1000) * fwdSpeed;
				const revShift = (time / 1000) * revSpeed;
				const fwdId = `link-${link.uuid}-fwd`;
				const revId = `link-${link.uuid}-rev`;
				if (map.getLayer(fwdId)) map.setPaintProperty(fwdId, 'line-dasharray', dashArrayForShift(fwdShift, DASH_LEN, GAP_LEN));
				if (map.getLayer(revId)) map.setPaintProperty(revId, 'line-dasharray', dashArrayForShift(revShift, DASH_LEN, GAP_LEN));
			}*/

			updatePacketMarkers(map, network, rafTime, packetMarkersRef.current);

			frameId = requestAnimationFrame(animate);
		};

		// delay animation start to allow map components to fully load
		if(startAnimationPromise.current) clearTimeout(startAnimationPromise.current);

		startAnimationPromise.current = setTimeout(() => {
			animationStartTime = performance.now();
			frameId = requestAnimationFrame(animate);
		}, 1000);
		

		return () => {
			cancelAnimationFrame(frameId);
			if(startAnimationPromise.current) clearTimeout(startAnimationPromise.current);
			for (const marker of packetMarkersRef.current.values()) marker.remove();
			packetMarkersRef.current.clear();
		};
	}, [mapLoaded, linkList, network]);

	const initialCenter = towerList[0]?.position ?? [0, 0];

	return (
		<div className="relative w-full h-full mt-2 rounded-lg overflow-hidden shadow-lg bg-gray-500/50 invert-100 contrast-140 dark:filter-none">
			<MapGL
				ref={mapRef}
				initialViewState={{
					longitude: initialCenter[0],
					latitude: initialCenter[1],
					zoom: 14,
				}}
				style={{ width: '100%', height: '100%' }}
				//hide labels
				mapStyle={mapStyles[4]}
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				interactive={true}
				attributionControl={false}
				onLoad={handleMapLoad}
			>
				{/* Connections */}
				{mapLoaded && linkList.map(link => {
					const start = network.towers[link.start_id];
					const end = network.towers[link.end_id];
					if (!start || !end) return null;

					const opacityFwd = linkCapacities.length > 1
						? map_range(link.capacity_fwd, minLinkCapacity, maxLinkCapacity, 0.1, 0.8)
						: 1;
					const opacityRev = linkCapacities.length > 1
						? map_range(link.capacity_rev, minLinkCapacity, maxLinkCapacity, 0.1, 0.8)
						: 1;
					const colorFwd = loadColor(linkLoad(link.queue_fwd, link.in_transit_fwd, link.capacity_fwd));
					const colorRev = loadColor(linkLoad(link.queue_rev, link.in_transit_rev, link.capacity_rev));

					// separate geometries per direction so fwd/rev marching directions are independent, not just sign-mirrored
					const geojsonFwd = {
						type: 'Feature' as const,
						geometry: {
							type: 'LineString' as const,
							coordinates: [start.position, end.position],
						},
						properties: {},
					};
					const geojsonRev = {
						type: 'Feature' as const,
						geometry: {
							type: 'LineString' as const,
							coordinates: [end.position, start.position],
						},
						properties: {},
					};

					return (
						<Fragment key={link.uuid}>
							{/* forward direction */}
							{link.capacity_fwd > 0 && (
								<Source id={`link-${link.uuid}-fwd-src`} type="geojson" data={geojsonFwd}>
									<Layer
										id={`link-${link.uuid}-fwd`}
										type="line"
										paint={{
											'line-color': colorFwd,
											'line-width': LINE_WIDTH,
											'line-opacity': opacityFwd,
											'line-offset': LINE_WIDTH,
											//'line-dasharray': dashArrayForShift(0, DASH_LEN, GAP_LEN),
										}}
									/>
								</Source>
							)}
							{/* reverse direction: reversed coordinates, so a positive offset lands on the opposite side from fwd */}
							{link.capacity_rev > 0 && (
								<Source id={`link-${link.uuid}-rev-src`} type="geojson" data={geojsonRev}>
									<Layer
										id={`link-${link.uuid}-rev`}
										type="line"
										paint={{
											'line-color': colorRev,
											'line-width': LINE_WIDTH,
											'line-opacity': opacityRev,
											'line-offset': LINE_WIDTH,
											//'line-dasharray': dashArrayForShift(0, DASH_LEN, GAP_LEN),
										}}
									/>
								</Source>
							)}
						</Fragment>
					);
				})}

				{/* Towers */}
				{towerList.map(tower => {
					const capacity = towerCapacity(tower);
					const size = maxTowerCapacity > minTowerCapacity
						? map_range(capacity, minTowerCapacity, maxTowerCapacity, 8, 16)
						: 20;
					const color = loadColor(towerLoad(tower));

					return (
						<Marker key={tower.uuid} longitude={tower.position[0]} latitude={tower.position[1]}  anchor="center" style={{ zIndex: TOWER_Z_INDEX }}>
							<div
								className="rounded-full outline outline-2 outline-black/40 shadow-md -outline-offset-2"
								style={{ width: size, height: size, backgroundColor: color }}
								title={tower.uuid}
							/>
						</Marker>
					);
				})}
			</MapGL>

			{/* Legend */}
			<div className="absolute bottom-2 z-20 left-2 bg-black/30 text-gray-300 backdrop-blur-sm rounded-lg shadow-lg p-2 text-xs min-w-30">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full border-2 border-white/80" style={{ backgroundColor: loadColor(0) }} />
						<span>Tower</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: loadColor(0) }} />
						<span>Link</span>
					</div>
				</div>
			</div>
		</div>
	);
}