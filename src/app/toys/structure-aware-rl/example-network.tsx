import { Network, Tower, NetworkLink, Packet, distance } from './network';

const TOWER_COUNT = 15;
const PACKET_COUNT = 50;

function randomPacketColor(): string {
	return `hsl(${Math.round(Math.random() * 360)}, 70%, 55%)`;
}

function distributeSparceCircle(center: [number, number], radius: number, count: number, minDistance: number = 0.01): [number, number][] {
	const positions: [number, number][] = [[center[0], center[1]]];
	for (let i = 0; i < count - 1; i++) {
		let r = 0;
		let theta = 0;
		for (let j = 0; j < 100; j++) {
			r = Math.random() * radius;
			theta = Math.random() * 2 * Math.PI;
			const newPos: [number, number] = [center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)];
			if (positions.every(pos => distance(pos, newPos) > minDistance)) {
				positions.push(newPos);
				break;
			}
		}
	}
	return positions;
}

function edgeExists(edges: [number, number][], a: number, b: number): boolean {
	return edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

// walks the graph from index 0, then greedily bridges the shortest in-group/out-group gap
// (by position distance) until every node is reachable, mutating edges in place
function ensureConnected(positions: [number, number][], edges: [number, number][]): void {
	const count = positions.length;
	if (count === 0) return;

	const connections: Set<number>[] = Array.from({ length: count }, () => new Set<number>());
	edges.forEach(([a, b]) => {
		connections[a].add(b);
		connections[b].add(a);
	});

	const in_group = new Set<number>([0]);
	const out_group = new Set<number>();
	for (let i = 1; i < count; i++) out_group.add(i);

	function mark_connected(index: number) {
		connections[index].forEach((connectedIndex) => {
			if (out_group.has(connectedIndex)) {
				in_group.add(connectedIndex);
				out_group.delete(connectedIndex);
				mark_connected(connectedIndex);
			}
		});
	}

	mark_connected(0);
	while (out_group.size > 0) {
		let shortestDist = Infinity;
		let closestPair: [number, number] | null = null;
		in_group.forEach((inIndex) => {
			out_group.forEach((outIndex) => {
				const dist = distance(positions[inIndex], positions[outIndex]);
				if (dist < shortestDist) {
					shortestDist = dist;
					closestPair = [inIndex, outIndex];
				}
			});
		});
		if (closestPair) {
			const [inIndex, outIndex] = closestPair as [number, number];
			edges.push([inIndex, outIndex]);
			connections[inIndex].add(outIndex);
			connections[outIndex].add(inIndex);
			in_group.add(outIndex);
			out_group.delete(outIndex);
			mark_connected(outIndex);
		}
	}
}

function linesIntersect(p1: [number, number], p2: [number, number], q1: [number, number], q2: [number, number]): boolean {
	const det = (p2[0] - p1[0]) * (q2[1] - q1[1]) - (p2[1] - p1[1]) * (q2[0] - q1[0]);
	if (det === 0) return false; // parallel lines
	const lambda = ((q2[1] - q1[1]) * (q2[0] - p1[0]) + (q1[0] - q2[0]) * (q2[1] - p1[1])) / det;
	const gamma = ((p1[1] - p2[1]) * (q2[0] - p1[0]) + (p2[0] - p1[0]) * (q2[1] - p1[1])) / det;
	return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

//takes positions and edges, and add random stats
function randomNetworkStats(positions: [number, number][], edges: [number, number][]): { towers: Record<string, Tower>; links: Record<string, NetworkLink> } {

	const towers: Record<string, Tower> = {};
	positions.forEach((position, i) => {
		const uuid = `tower-${i}`;
		towers[uuid] = { uuid, position, packets: {}, connected_links: [] };
	});

	const towerIds = Object.keys(towers);
	const links: Record<string, NetworkLink> = {};
	edges.forEach(([a, b], i) => {
		const uuid = `link-${i}`;
		links[uuid] = {
			uuid,
			start_id: towerIds[a],
			end_id: towerIds[b],
			capacity_fwd: 2 + Math.round(Math.random() * 8),
			capacity_rev: 2 + Math.round(Math.random() * 8),
			propagation_delay_fwd: distance(towers[towerIds[a]].position, towers[towerIds[b]].position) * 100000, // in ms
			propagation_delay_rev: distance(towers[towerIds[a]].position, towers[towerIds[b]].position) * 100000, // in ms
			queue_fwd: [],
			queue_rev: [],
			in_transit_fwd: [],
			in_transit_rev: [],
		};
		towers[towerIds[a]].connected_links.push(uuid);
		towers[towerIds[b]].connected_links.push(uuid);
	});

	return { towers, links };
}

// generates a small k-nearest-neighbor-ish topology, then bridges any disconnected groups
function generateSampleTopology(towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>; links: Record<string, NetworkLink> } {
	const center: [number, number] = [-80.4139, 37.2296]; // Blacksburg, VA
	const positions: [number, number][] = distributeSparceCircle(center, 0.03, towerCount);
	const edges: [number, number][] = [];

	// connect each tower to its closest neighbor
	positions.forEach((position, i) => {
		let closestDist = Infinity;
		let closestIndex = -1;
		positions.forEach((pos, j) => {
			if (i === j) return;
			const dist = distance(position, pos);
			if (dist < closestDist) {
				closestDist = dist;
				closestIndex = j;
			}
		});
		if (closestIndex !== -1 && !edgeExists(edges, i, closestIndex)) {
			edges.push([i, closestIndex]);
		}
	});

	ensureConnected(positions, edges);

	return randomNetworkStats(positions, edges);
}

function generateKNearestNeighborsTopology(k: number, towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>, links: Record<string, NetworkLink> } {
	
	const center : [number, number] = [-80.4139, 37.2296]; // Blacksburg, VA
	const positions: [number, number][] = distributeSparceCircle(center, 0.03, towerCount);



	// connect to k nearest neighbors, use edgeExists to detect duplicates

	const edges: [number, number][] = [];
	for (let i = 0; i < towerCount; i++) {
		const distances = positions.map((pos, j) => ({ index: j, dist: distance(positions[i], pos) }))
			.filter(({ index }) => index !== i)
			.sort((a, b) => a.dist - b.dist);
		for (let n = 0; n < k && n < distances.length; n++) {
			const j = distances[n].index;
			if (!edgeExists(edges, i, j)) {
				edges.push([i, j]);
			}
		}
	}

	ensureConnected(positions, edges);

	return randomNetworkStats(positions, edges);
}

function generateBigSmallTopology(connectorDensity: number, towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>, links: Record<string, NetworkLink> } {

	const center: [number, number] = [-80.4139, 37.2296]; // Blacksburg, VA
	const positions: [number, number][] = distributeSparceCircle(center, 0.03, towerCount);

	const edges: [number, number][] = [];
	
	// generate close, non-overlapping edges
	// attempt to connect tower to k nearest neighbors
	// check to intersections with existing edges
	// delete longer edge

	const K_NEAREST = 4;
	// k nearest neighbors
	for (let i = 0; i < positions.length; i++) {
		const distances = positions.map((pos, j) => ({ index: j, dist: distance(positions[i], pos) }))
			.filter(({ index }) => index !== i)
			.sort((a, b) => a.dist - b.dist);
		for (let n = 0; n < K_NEAREST && n < distances.length; n++) {
			const j = distances[n].index;
			if (!edgeExists(edges, i, j)) {
				edges.push([i, j]);
			}
		}
	}

	// check for intersecting edges and remove the longer one
	for (let i = 0; i < edges.length; i++) {
		for (let j = i + 1; j < edges.length; j++) {
			const [a1, b1] = edges[i];
			const [a2, b2] = edges[j];
			if (linesIntersect(positions[a1], positions[b1], positions[a2], positions[b2])) {
				const dist1 = distance(positions[a1], positions[b1]);
				const dist2 = distance(positions[a2], positions[b2]);
				if (dist1 > dist2) {
					edges.splice(i, 1);
					i--;
					break;
				} else {
					edges.splice(j, 1);
					j--;
				}
			}
		}
	}

	// add sparse, long connections
	for (let i = 0; i < positions.length * connectorDensity; i++) {
		let randomSource = Math.floor(Math.random() * positions.length);
		let randomDest = Math.floor(Math.random() * positions.length);
		for (let j = 0; j < 100 && (randomSource === randomDest || edgeExists(edges, randomSource, randomDest)); j++) {
			randomDest = Math.floor(Math.random() * positions.length);
		}
		edges.push([randomSource, randomDest]);
	}
	ensureConnected(positions, edges);

	return randomNetworkStats(positions, edges);
}

function generateDirectedRingTopology(last_k : number, towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>, links: Record<string, NetworkLink> } {

	const RADIUS = 0.015;
	const center: [number, number] = [-80.4139, 37.2296]; // Blacksburg, VA

	const positions: [number, number][] = [];
	const edges: [number, number][] = [];

	for(let theta = Math.PI/towerCount; theta < 2*Math.PI; theta += 2*Math.PI/towerCount){
		const r = RADIUS * (Math.random()+0.75)
		const x = center[0] + r * Math.cos(theta);
		const y = center[1] + r * Math.sin(theta);
		positions.push([x, y]);
		// connect to last k towers
		for (let k = 1; k <= last_k; k++) {
			const j = (positions.length - 1 - k + towerCount) % towerCount;
			edges.push([positions.length - 1, j]);
		}
	}

	const { towers, links } = randomNetworkStats(positions, edges);
	// remove all reverse edges
	Object.keys(links).forEach((key) => {
		links[key].capacity_rev = 0;
	});

	return { towers, links };

}


// two dense clusters (left/right half) with non-overlapping knn edges, bridged by exactly two bottleneck links (upper and lower)
function generateBottleneckTopology(towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>, links: Record<string, NetworkLink> } {

	const center: [number, number] = [-80.41, 37.2296];
	const separation: number = 0.015;
	const leftCenter: [number, number] = [center[0], center[1]-separation];
	const rightCenter: [number, number] = [center[0], center[1]+separation];
	const halfCount = Math.floor(towerCount / 2);

	const leftPositions = distributeSparceCircle(leftCenter, 0.005, halfCount, 0.003);
	const rightPositions = distributeSparceCircle(rightCenter, 0.005, towerCount - halfCount, 0.003);
	// stretch left and right clusters horizontally
	leftPositions.forEach(([x, y], i) => leftPositions[i] = [(x-center[0])*3+center[0], y]);
	rightPositions.forEach(([x, y], i) => rightPositions[i] = [(x-center[0])*3+center[0], y]);

	const positions: [number, number][] = [...leftPositions, ...rightPositions];
	const leftIndices = leftPositions.map((_, i) => i);
	const rightIndices = rightPositions.map((_, i) => i + halfCount);

	const edges: [number, number][] = [];
	const K_NEAREST = 3;

	// connect each half internally to its k nearest neighbors within the same half
	[leftIndices, rightIndices].forEach((group) => {
		group.forEach((i) => {
			const distances = group.map((j) => ({ index: j, dist: distance(positions[i], positions[j]) }))
				.filter(({ index }) => index !== i)
				.sort((a, b) => a.dist - b.dist);
			for (let n = 0; n < K_NEAREST && n < distances.length; n++) {
				const j = distances[n].index;
				if (!edgeExists(edges, i, j)) edges.push([i, j]);
			}
		});
	});

	// remove intersecting edges within each half, keeping the shorter one
	for (let i = 0; i < edges.length; i++) {
		for (let j = i + 1; j < edges.length; j++) {
			const [a1, b1] = edges[i];
			const [a2, b2] = edges[j];
			if (linesIntersect(positions[a1], positions[b1], positions[a2], positions[b2])) {
				const dist1 = distance(positions[a1], positions[b1]);
				const dist2 = distance(positions[a2], positions[b2]);
				if (dist1 > dist2) {
					edges.splice(i, 1);
					i--;
					break;
				} else {
					edges.splice(j, 1);
					j--;
				}
			}
		}
	}

	// runs ensureConnected on each half's local edge list, then merges any bridge edges back into the shared list
	function ensureHalfConnected(indices: number[]) {
		const localPositions = indices.map((i) => positions[i]);
		const localEdges: [number, number][] = [];
		edges.forEach(([a, b]) => {
			if (indices.includes(a) && indices.includes(b)) {
				localEdges.push([indices.indexOf(a), indices.indexOf(b)]);
			}
		});
		ensureConnected(localPositions, localEdges);
		localEdges.forEach(([a, b]) => {
			const globalA = indices[a];
			const globalB = indices[b];
			if (!edgeExists(edges, globalA, globalB)) edges.push([globalA, globalB]);
		});
	}
	ensureHalfConnected(leftIndices);
	ensureHalfConnected(rightIndices);

	// bridge the two halves with exactly two bottleneck links: farthest left and right

	const leftMost1 = leftIndices.reduce((minIdx, li) => (positions[li][0] < positions[minIdx][0] ? li : minIdx), leftIndices[0]);
	const leftMost2 = leftIndices.reduce((maxIdx, li) => (positions[li][0] > positions[maxIdx][0] ? li : maxIdx), leftIndices[0]);
	const rightMost1 = rightIndices.reduce((minIdx, ri) => (positions[ri][0] < positions[minIdx][0] ? ri : minIdx), rightIndices[0]);
	const rightMost2 = rightIndices.reduce((maxIdx, ri) => (positions[ri][0] > positions[maxIdx][0] ? ri : maxIdx), rightIndices[0]);
	const bottleneckIndex1 = edges.length;
	edges.push([leftMost1, rightMost1]);
	const bottleneckIndex2 = edges.length;
	edges.push([leftMost2, rightMost2]);

	const { towers, links} =  randomNetworkStats(positions, edges);

	// leftmost bridge is fast but low capacity, rightmost is slow but high capacity
	const link1 = links[`link-${bottleneckIndex1}`];
	link1.capacity_fwd = 1;
	link1.capacity_rev = 1;
	link1.propagation_delay_fwd = 300;
	link1.propagation_delay_rev = 300;

	const link2 = links[`link-${bottleneckIndex2}`];
	link2.capacity_fwd = 200;
	link2.capacity_rev = 200;
	link2.propagation_delay_fwd = 3000;
	link2.propagation_delay_rev = 3000;

	return {towers, links};
}

// two vertical high-capacity highway columns (left/right) with occasional cross-links between them
function generateParallelHighwaysTopology(rungDensity: number = 0.3, towerCount: number = TOWER_COUNT): { towers: Record<string, Tower>, links: Record<string, NetworkLink> } {

	const center: [number, number] = [-80.4139, 37.2296];
	const columnHeight = 0.05;
	const columnSpacing = 0.01;
	const halfCount = Math.floor(towerCount / 2);

	const leftPositions: [number, number][] = Array.from({ length: halfCount }, (_, i) => [
		center[0] - columnSpacing / 2 + (Math.random() - 0.5) * 0.005,
		center[1] - columnHeight / 2 + (columnHeight * i) / (halfCount - 1) + (Math.random() - 0.5) * 0.005,
	]);
	const rightPositions: [number, number][] = Array.from({ length: towerCount - halfCount }, (_, i) => [
		center[0] + columnSpacing / 2 + (Math.random() - 0.5) * 0.005,
		center[1] - columnHeight / 2 + (columnHeight * i) / (towerCount - halfCount - 1) + (Math.random() - 0.5) * 0.005,
	]);
	const positions: [number, number][] = [...leftPositions, ...rightPositions];
	const leftIndices = leftPositions.map((_, i) => i);
	const rightIndices = rightPositions.map((_, i) => i + halfCount);

	const edges: [number, number][] = [];
	// chain each column into a highway
	for (let i = 0; i < leftIndices.length - 1; i++) edges.push([leftIndices[i], leftIndices[i + 1]]);
	for (let i = 0; i < rightIndices.length - 1; i++) edges.push([rightIndices[i], rightIndices[i + 1]]);

	// occasional rungs connecting the two highways
	const rungCount = Math.max(1, Math.round(Math.min(leftIndices.length, rightIndices.length) * rungDensity));
	const usedLeft = new Set<number>();
	for (let n = 0; n < rungCount; n++) {
		let li = Math.floor(Math.random() * leftIndices.length);
		for (let attempt = 0; attempt < 20 && usedLeft.has(li); attempt++) li = Math.floor(Math.random() * leftIndices.length);
		usedLeft.add(li);
		const targetY = positions[leftIndices[li]][1];
		let closestRi = rightIndices[0];
		let closestDist = Infinity;
		rightIndices.forEach((ri) => {
			const d = Math.abs(positions[ri][1] - targetY);
			if (d < closestDist && Math.random() < 0.5) {
				closestDist = d;
				closestRi = ri;
			}
		});
		if (!edgeExists(edges, leftIndices[li], closestRi)) edges.push([leftIndices[li], closestRi]);
	}

	ensureConnected(positions, edges);

	const { towers, links } = randomNetworkStats(positions, edges);
	// boost capacity for the highway spine links (consecutive same-column connections)
	Object.values(links).forEach((link) => {
		const startTower = towers[link.start_id];
		const endTower = towers[link.end_id];
		const startIsLeftColumn = leftIndices.some((i) => `tower-${i}` === startTower.uuid);
		const endIsLeftColumn = leftIndices.some((i) => `tower-${i}` === endTower.uuid);
		if (startIsLeftColumn === endIsLeftColumn) {
			link.capacity_fwd = 15 + Math.round(Math.random() * 10);
			link.capacity_rev = 15 + Math.round(Math.random() * 10);
		}
	});

	return { towers, links };
}

// drops PACKET_COUNT packets onto random towers, each headed to another random tower
function distributeInitialPackets(network: Network) {
	const towerIds = Object.keys(network.towers);
	if (towerIds.length < 2) return;
	for (let i = 0; i < PACKET_COUNT; i++) {
		const sourceId = towerIds[Math.floor(Math.random() * towerIds.length)];
		let destId = towerIds[Math.floor(Math.random() * towerIds.length)];
		while (destId === sourceId) {
			destId = towerIds[Math.floor(Math.random() * towerIds.length)];
		}
		const packet: Packet = {
			uuid: `packet-${i}`,
			source_node_id: sourceId,
			current_node_id: sourceId,
			destination_node_id: destId,
			start_time: performance.now(),
			last_jump_time: performance.now(),
			total_jumps: 0,
			size: 1,
			color: randomPacketColor(),
		};
		network.towers[sourceId].packets[packet.uuid] = packet;
	}
}

// naive routing: every tick, forward each packet that hasn't arrived to a random connected neighbor
function routePacketsRandomly(network: Network) {
	for (const tower of Object.values(network.towers)) {
		for (const packet of Object.values(tower.packets)) {
			//if (packet.current_node_id === packet.destination_node_id) continue;
			const neighborLinks = tower.connected_links.map((id) => network.links[id]).filter(Boolean);
			if (neighborLinks.length === 0) continue;
			const link = neighborLinks[Math.floor(Math.random() * neighborLinks.length)];
			const neighborId = link.start_id === tower.uuid ? link.end_id : link.start_id;
			network.transmit(tower.uuid, neighborId, packet.uuid);
		}
	}
}

export type TopologyType = 'sample' | 'knn' | 'bigSmall' | 'directedRing' | 'bottleneck' | 'parallelHighways';

function generateTopology(type: TopologyType): { towers: Record<string, Tower>; links: Record<string, NetworkLink> } {
	switch (type) {
		case 'knn':
			return generateKNearestNeighborsTopology(3, 10);
		case 'bigSmall':
			return generateBigSmallTopology(0.2);
		case 'directedRing':
			return generateDirectedRingTopology(2);
		case 'bottleneck':
			return generateBottleneckTopology();
		case 'parallelHighways':
			return generateParallelHighwaysTopology(0.3, 20);
		case 'sample':
		default:
			return generateSampleTopology();
	}
}

export function createExampleNetwork(type: TopologyType = 'sample'): Network {
	const { towers, links } = generateTopology(type);
	return new Network({
		towers,
		links,
		onCreate: distributeInitialPackets,
		onUpdate: routePacketsRandomly,
	});
}
