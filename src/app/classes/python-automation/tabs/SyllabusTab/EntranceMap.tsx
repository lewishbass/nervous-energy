import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaAngleDown } from 'react-icons/fa';
import { copyToClipboard } from '@/scripts/clipboard';

const bicubicSmoothing = (path: [number, number][]): [number, number][] => {
	if (path.length < 2) return path;
	if (path.length === 2) return path;

	const smoothed: [number, number][] = [];
	const tension = 0.25; // Catmull-Rom tension (0.5 is standard)
	const numSegments = 4; // Points between each pair

	// Add first point
	smoothed.push(path[0]);

	// Catmull-Rom spline interpolation
	for (let i = 0; i < path.length - 1; i++) {
		const p0 = path[Math.max(0, i - 1)];
		const p1 = path[i];
		const p2 = path[i + 1];
		const p3 = path[Math.min(path.length - 1, i + 2)];

		for (let t = 0; t < numSegments; t++) {
			const t1 = t / numSegments;
			const t2 = t1 * t1;
			const t3 = t2 * t1;

			// Catmull-Rom basis functions
			const q0 = -tension * t3 + 2 * tension * t2 - tension * t1;
			const q1 = (2 - tension) * t3 + (tension - 3) * t2 + 1;
			const q2 = (tension - 2) * t3 + (3 - 2 * tension) * t2 + tension * t1;
			const q3 = tension * t3 - tension * t2;

			const lon = q0 * p0[0] + q1 * p1[0] + q2 * p2[0] + q3 * p3[0];
			const lat = q0 * p0[1] + q1 * p1[1] + q2 * p2[1] + q3 * p3[1];

			smoothed.push([lon, lat]);
		}
	}

	// Add last point
	smoothed.push(path[path.length - 1]);

	return smoothed;
};


export type EntranceMapProps = {
	location: [number, number];
	parkingPolygon?: [number, number][]; // Array of [lon, lat] for polygon
	entrancePath?: [number, number][]; // Array of [lon, lat] for path
};

export default function EntranceMap({ location, parkingPolygon, entrancePath }: EntranceMapProps){
	const [lat, lon] = location;
	const mapStyles:string[] = [
		"mapbox://styles/mapbox/streets-v11",
		"mapbox://styles/mapbox/satellite-v9",
		"mapbox://styles/mapbox/outdoors-v11",
		"mapbox://styles/mapbox/light-v10",
		"mapbox://styles/mapbox/dark-v10",
	]

	const handleMapClick = (event: any) => {
		const { lng, lat } = event.lngLat;
		const coordsText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
		copyToClipboard(coordsText, 'Coordinates Copied!');
	};

	const smoothedPath = entrancePath && entrancePath.length > 0 ? bicubicSmoothing(entrancePath) : [];

	return (
		<div className="relative w-full h-64 mt-2 rounded-lg overflow-hidden shadow-lg bg-gray-500/50 invert-100 contrast-140 dark:filter-none">
			<Map
				initialViewState={{
					latitude: lat,
					longitude: lon,
					zoom: 16,
				}}
				style={{ width: '100%', height: '100%' }}
				mapStyle={mapStyles[4]}
				mapboxAccessToken="pk.eyJ1Ijoid29ybGRzaW5nZXIiLCJhIjoiY202Z2hscG9zMDFhczJpb296Y2I2dDlvayJ9.Fv0uqkCRxvu1tb07rt5Qog"
				interactive={true}
				attributionControl={false}
				onClick={handleMapClick}
			>
				{/* Parking Polygon */}
				{parkingPolygon && parkingPolygon.length > 0 && (
					<Source
						id="parking-polygon"
						type="geojson"
						data={{
							type: 'Feature',
							geometry: {
								type: 'Polygon',
								coordinates: [[...parkingPolygon, parkingPolygon[0]]], // Close the polygon
							},
							properties: {},
						}}
					>
						<Layer
							id="parking-fill"
							type="fill"
							paint={{
								'fill-color': '#c47d09',
								'fill-opacity': 0.4,
							}}
						/>
						<Layer
							id="parking-outline"
							type="line"
							paint={{
								'line-color': '#da9c14',
								'line-width': 2,
							}}
						/>
					</Source>
				)}

				{/* Entrance Path */}
				{smoothedPath && smoothedPath.length > 0 && (
					<Source
						id="entrance-path"
						type="geojson"
						data={{
							type: 'Feature',
							geometry: {
								type: 'LineString',
								coordinates: smoothedPath,
							},
							properties: {},
						}}
					>
						<Layer
							id="path-line"
							type="line"
							paint={{
								'line-color': '#ad307f',
								'line-width': 3,
								'line-dasharray': [2, 1],
							}}
						/>
						
					</Source>
				)}
				
				<Marker longitude={lon} latitude={lat} anchor="bottom">
					<FaAngleDown
						className={`inline-block mr-2 text-[#0ff] text-3xl -mb-2`}
					/>
				</Marker>
			</Map>

			{/* Legend */}
			<div className="absolute bottom-2 z-20 left-2 bg-black/30 text-gray-300 backdrop-blur-sm rounded-lg shadow-lg p-2 text-xs">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<FaAngleDown className="text-[#0ff] text-sm" />
						<span>Entrance</span>
					</div>
					{parkingPolygon && parkingPolygon.length > 0 && (
						<div className="flex items-center gap-2">
							<div className="w-4 h-3 bg-[#c47d0960] border-2 border-[#da9c14] rounded-sm"></div>
							<span>Covered Parking</span>
						</div>
					)}
					{entrancePath && entrancePath.length > 0 && (
						<div className="flex items-center gap-2">
							<div className="w-4 h-0.5 border-t-2 border-dashed border-[#a8297a]"></div>
							<span>Parking Path</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}