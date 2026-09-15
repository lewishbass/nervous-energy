// Core network simulation types and the Network class.
// Rendering (map, animation) lives in network-toy.tsx; example topologies live in example-network.tsx.

export type Tower = {
	uuid: string;
	position: [number, number]; // [lon, lat]
	packets: Record<string, Packet>;
	connected_links: string[];
};

export type NetworkLink = {
	uuid: string;
	start_id: string;
	end_id: string;
	capacity_fwd: number;
	capacity_rev: number;
	propagation_delay_fwd: number;
	propagation_delay_rev: number;
	queue_fwd: Packet[];
	queue_rev: Packet[];
	in_transit_fwd: InTransitPacket[];
	in_transit_rev: InTransitPacket[];
};

export type InTransitPacket = {
	packet: Packet;
	departure_time: number;
	arrival_time: number;
};

export type Packet = {
	uuid: string;
	source_node_id: string;
	current_node_id: string;
	destination_node_id: string;
	start_time: number;
	last_jump_time: number;
	total_jumps: number;
	size: number;
	color: string;
};

export function distance(a: [number, number], b: [number, number]): number {
	return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export type NetworkOptions = {
	towers: Record<string, Tower>;
	links: Record<string, NetworkLink>;
	onCreate?: (network: Network) => void;
	onUpdate?: (network: Network) => void;
};

// Owns the towers/links state and the queue -> in-transit -> delivery simulation.
// onUpdate runs on a timer for decision-making (e.g. choosing routes). logic_update is
// physics-only and is expected to be driven by the consumer's render loop (every frame)
// so packet motion stays smooth regardless of the decision tick speed.
export class Network {
	towers: Record<string, Tower>;
	links: Record<string, NetworkLink>;
	onCreate?: (network: Network) => void;
	onUpdate?: (network: Network) => void;

	private intervalId: ReturnType<typeof setInterval> | null = null;
	private tickSeconds: number = 1;

	constructor(options: NetworkOptions) {
		this.towers = options.towers;
		this.links = options.links;
		this.onCreate = options.onCreate;
		this.onUpdate = options.onUpdate;
		this.onCreate?.(this);
	}

	start_updating(seconds_per_tick: number) {
		this.stop_updating();
		this.tickSeconds = seconds_per_tick;
		this.intervalId = setInterval(() => this.onUpdate?.(this), seconds_per_tick * 1000);
	}

	stop_updating() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	// can be called while the network is still running; restarts the interval at the new speed
	set_tick_speed(seconds_per_tick: number) {
		this.tickSeconds = seconds_per_tick;
		if (this.intervalId !== null) {
			this.start_updating(seconds_per_tick);
		}
	}

	// finds the link directly connecting source and dest, and which direction it travels in
	private findLink(source_id: string, dest_id: string): { link: NetworkLink; forward: boolean } | null {
		const source = this.towers[source_id];
		if (!source) return null;
		for (const linkId of source.connected_links) {
			const link = this.links[linkId];
			if (!link) continue;
			if (link.start_id === source_id && link.end_id === dest_id) return { link, forward: true };
			if (link.end_id === source_id && link.start_id === dest_id) return { link, forward: false };
		}
		return null;
	}

	// moves a packet off its source tower and into the outbound queue toward dest, if connected
	transmit(source_id: string, dest_id: string, packet_id: string): boolean {
		const source = this.towers[source_id];
		const packet = source?.packets[packet_id];
		if (!source || !packet) return false;
		const found = this.findLink(source_id, dest_id);
		if (!found) return false;

		// check to make sure capacity >0
		if (found.forward && found.link.capacity_fwd <= 0) return false;
		if (!found.forward && found.link.capacity_rev <= 0) return false;

		delete source.packets[packet_id];
		if (found.forward) {
			found.link.queue_fwd.push(packet);
		} else {
			found.link.queue_rev.push(packet);
		}
		return true;
	}

	// common simulation step: queue -> in-transit (respecting capacity) -> delivered to destination tower
	logic_update(time: number) {
		for (const link of Object.values(this.links)) {
			this.advanceQueue(link, true, time);
			this.advanceQueue(link, false, time);
			this.advanceInTransit(link, true, time);
			this.advanceInTransit(link, false, time);
		}
	}

	private advanceQueue(link: NetworkLink, forward: boolean, time: number) {
		const queue = forward ? link.queue_fwd : link.queue_rev;
		const in_transit = forward ? link.in_transit_fwd : link.in_transit_rev;
		const capacity = forward ? link.capacity_fwd : link.capacity_rev;
		const delay = forward ? link.propagation_delay_fwd : link.propagation_delay_rev;
		while (in_transit.length < capacity && queue.length > 0) {
			const packet = queue.shift()!;
			packet.last_jump_time = time;
			in_transit.push({ packet, departure_time: time, arrival_time: time + delay });
		}
	}

	private advanceInTransit(link: NetworkLink, forward: boolean, time: number) {
		const in_transit = forward ? link.in_transit_fwd : link.in_transit_rev;
		const dest_id = forward ? link.end_id : link.start_id;
		for (let i = in_transit.length - 1; i >= 0; i--) {
			const item = in_transit[i];
			if (time < item.arrival_time) continue;
			in_transit.splice(i, 1);
			const dest = this.towers[dest_id];
			if (!dest) continue;
			item.packet.current_node_id = dest_id;
			item.packet.total_jumps += 1;
			dest.packets[item.packet.uuid] = item.packet;
		}
	}
}
