"use client";

import Image from "next/image";
import { copyToClipboard } from "../../scripts/clipboard";
import { useEffect, useState } from "react";
import LineAnimation from '@/components/backgrounds/LineAnimation';

interface ServerStatus {
	online: boolean;
	players: {
		online: number;
		max: number;
	};
	version: string;
	motd: string;
}

interface ModDependency {
	name: string;
	slug: string;
	summary: string;
	downloadCount: number;
	url: string;
}

function CheckingAnimation() {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots(prev => prev.length >= 3 ? "" : prev + ".");
		}, 100);
		return () => clearInterval(interval);
	}, []);

	return <span>Checking{dots}</span>;
}

export default function Minecraft() {
	const serverIP = "mc.lewisbass.org";
	const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [dependencies, setDependencies] = useState<ModDependency[]>([]);
	const [depsLoading, setDepsLoading] = useState(true);
	const [depsError, setDepsError] = useState<string | null>(null);

	const fetchStatus = async () => {
		
		try {
			const res = await fetch('/.netlify/functions/msc_fetch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ action: 'fetch_mc_status', server_ip: serverIP }),
			});
			const data = await res.json();
			setServerStatus(data);
		} catch (error) {
			console.error('Failed to fetch server status:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchDependencies = async () => {
		setDepsLoading(true);
		setDepsError(null);
		try {
			const res = await fetch('/.netlify/functions/msc_fetch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ action: 'fetch_modpack_deps' }),
			});
			const data = await res.json();
			
			if (data.error) {
				setDepsError(data.error);
			} else {
				setDependencies(data.dependencies || []);
			}
		} catch (error) {
			console.error('Failed to fetch modpack dependencies:', error);
			setDepsError('Failed to load modpack dependencies. Please try again later.');
		} finally {
			setDepsLoading(false);
		}
	};

	useEffect(() => {
		fetchStatus();
		const interval = setInterval(fetchStatus, 10000); // Update every 10 seconds
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		fetchDependencies();
	}, []);

	const modpackFeatures = [
		{
			title: "Performance Boost",
			icon: "/images/mc/Repeater.png",
			description: "Sodium and Lithium optimize rendering and lighting for smooth gameplay",
			color: "from-red-500/20 to-orange-500/20"
		},
		{
			title: "Extended Render Distance",
			icon: "/images/mc/Ender_Eye.png",
			description: "Bobby and Distant Horizons work together for incredible view distances",
			color: "from-purple-500/20 to-pink-500/20"
		},
		{
			title: "Beautiful Shaders",
			icon: "/images/mc/Diamond.png",
			description: "Complementary Shaders add vibrant shadows, torch lighting, and volumetric clouds",
			color: "from-cyan-500/20 to-blue-500/20"
		},
		{
			title: "Voice Chat",
			icon: "/images/mc/Name_Tag.png",
			description: "Simple Voice Chat enables proximity voice and chat groups on the server",
			color: "from-yellow-500/20 to-amber-500/20"
		},
		{
			title: "Quality of Life",
			icon: "/images/mc/Chest.png",
			description: "Inventory Tweaks adds convenient auto-sort buttons and organization tools",
			color: "from-green-500/20 to-emerald-500/20"
		},
		{
			title: "Vanilla Plus",
			icon: "/images/mc/Grass_Block.png",
			description: "Enhanced vanilla experience without game-changing modifications",
			color: "from-lime-500/20 to-green-500/20"
		}
	];

	return (
		<div className="p-6 max-w-6xl mx-auto mb-200">
			{/* Background animation */}
			<div className="absolute inset-0 -z-10 invert dark:invert-0">
				<LineAnimation
					spacing={200}
					seed={456}
					style={{ opacity: 0.5 }}
				/>
			</div>

			<h1 className="text-4xl font-bold mb-6 tc1">Minecraft Server</h1>

			{/* Hero Section */}
			<section className="mb-12 relative">
				<div className="bg1 relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 rounded-3xl p-8 shadow-lg border border-green-500/20 overflow-hidden">
					<Image
						src="/KH_figures.svg"
						alt=""
						className="absolute inset-0 w-full h-full object-cover opacity-100 mix-blend-soft-light dark:opacity-30 dark:invert select-none pointer-events-none"
						width={100}
						height={100}
					/>
					<div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
						<div className="flex-shrink-0">
							<Image src="/images/mc/Grass_Block.png" alt="Grass Block" width={120} height={120} className="pixelated" />
						</div>
						<div className="flex-grow">
							<div className="flex flex-col sm:flex-row items-center justify-between mb-4">
								<h2 className="text-3xl md:text-4xl font-bold mb-4 tc1">
									NervousEnergy
								</h2>
								<a
									href="https://www.curseforge.com/minecraft/modpacks/nervousenergy"
									target="_blank"
									rel="noopener noreferrer"
									className="select-none px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:brightness-110 transition-all hover:-translate-y-0.5 shadow-lg flex items-center"
								>
									<Image src="/images/mc/Diamond_Pickaxe.png" alt="Pickaxe" width={20} height={20} className="mr-2 pixelated" />
									Download Modpack
								</a>
							</div>


							<p className="text-xl tc2 mb-6">
								Join our vanilla-enhanced server with performance mods, beautiful shaders, and voice chat!
							</p>

						</div>
					</div>
				</div>
			</section>

			{/* Server Info Section */}
			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-6 tc1 flex items-center">
					<Image src="/images/mc/Diamond_Sword.png" alt="Sword" width={32} height={32} className="mr-3 pixelated" />
					<span className="backdrop-blur-sm rounded-lg px-2">Server Information</span>
					<button
						onClick={fetchStatus}
						disabled={loading}
						className="ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-rotate-180 active:-rotate-250 duration-500 cursor-pointer"
						title="Refresh server status"
					>
						<svg className="w-6 h-6 tc1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</button>
				</h2>
				<div className="bg1 relative rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

					<div className="space-y-4 relative z-10">
						<div className="flex flex-col sm:flex-row items-center gap-4">
							<div className="sm:mr-auto"><h3 className="text-2xl font-bold tc1 mb-2">Server Address</h3></div>
							<code className="text-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg tc1 font-mono select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all" onClick={() => copyToClipboard(serverIP)}>
								{serverIP}
							</code>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
							<div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
								<div className="text-sm tc2 mb-1 flex items-center">
									<Image src="/images/mc/Compass_30.png" alt="Compass" width={48} height={48} className="mr-2 pixelated" style={{ filter: "drop-shadow(0 0 4px #fff3)" }} />
									Version
								</div>
								<div className="text-2xl font-bold tc1">{serverStatus?.version || <CheckingAnimation />}</div>
							</div>
							<div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
								<div className="text-sm tc2 mb-1 flex items-center">
									<Image src="/images/mc/Filled_Map.png" alt="Map" width={48} height={48} className="mr-2 pixelated" style={{ filter: "drop-shadow(0 0 4px #fff3)" }} />
									Type
								</div>
								<div className="text-2xl font-bold tc1">Vanilla Plus</div>
							</div>
							<div className={`bg-gradient-to-br ${serverStatus?.online ? 'from-green-500/10 to-lime-500/10' : 'from-red-500/10 to-orange-500/10'} p-4 rounded-xl hover:scale-105 transition-all duration-300`}>
								<div className="text-sm tc2 mb-1 flex items-center">
									<Image 
										src={loading ? "/images/mc/gray_dye.png" : serverStatus?.online ? "/images/mc/Lime_Dye.png" : "/images/mc/Red_Dye.png"} 
										alt="Status" 
										width={48} 
										height={48} 
										className="mr-2 pixelated" 
										style={{ filter: "drop-shadow(0 0 4px #fff3)" }} 
									/>
									Status
								</div>
								<div className="text-2xl font-bold tc1">
									{loading ? <CheckingAnimation /> : serverStatus?.online ? 'Online' : 'Offline'}
								</div>
								{(!loading && serverStatus?.online) ? (
									<div className="text-sm tc2 mt-1">
										{serverStatus.players.online}/{serverStatus.players.max} players
									</div>
								) : <div>&nbsp;</div>}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-6 tc1 flex items-center">
					<Image src="/images/mc/Tnt.png" alt="TNT" width={32} height={32} className="mr-3 pixelated" />
					<span className="backdrop-blur-sm rounded-lg px-2">Modpack Features</span>
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modpackFeatures.map((feature, index) => (
						<div
							key={index}
							className={`relative bg-gradient-to-br ${feature.color} bg2 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 overflow-hidden`}
						>
							<Image
								src="/KH_figures.svg"
								alt=""
								className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-soft-light dark:opacity-7 dark:invert select-none pointer-events-none scale-150"
								style={{
									userSelect: "none",
									transform: `rotate(${index * 30}deg) scale(1.8)`, // Scale up by 1.5x to ensure coverage when rotated
									transformOrigin: "center center", // Ensure rotation happens from the center
								}}
								width={100}
								height={100}
							/>
							<div className="relative z-10">
								<div className="flex items-center mb-4">
									<div className="mr-4">
										<Image src={feature.icon} alt={feature.title} width={48} height={48} className="pixelated" style={{ filter: "drop-shadow(0 0 4px #fff3)" }} />
									</div>
									<h3 className="text-xl font-bold tc1">{feature.title}</h3>
								</div>
								<p className="tc2">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Modpack Dependencies Section 
			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-6 tc1 flex items-center">
					<Image src="/images/mc/Chest.png" alt="Chest" width={32} height={32} className="mr-3 pixelated" />
					Included Mods ({dependencies.length})
					<button
						onClick={fetchDependencies}
						disabled={depsLoading}
						className="ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-rotate-180 duration-500 cursor-pointer"
						title="Refresh mod list"
					>
						<svg className="w-6 h-6 tc1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</button>
				</h2>
				{depsLoading ? (
					<div className="bg2 rounded-3xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center tc1 text-xl">
						<CheckingAnimation />
					</div>
				) : depsError ? (
					<div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-8 shadow-lg border border-red-500/20 text-center">
						<Image src="/images/mc/Tnt.png" alt="Error" width={48} height={48} className="mx-auto mb-4 pixelated" />
						<h3 className="text-xl font-bold tc1 mb-2">Failed to Load Mods</h3>
						<p className="tc2">{depsError}</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{dependencies.map((dep, index) => (
							<a
								key={index}
								href={dep.url}
								target="_blank"
								rel="noopener noreferrer"
								className="bg2 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 hover:border-green-500/50 transition-all duration-300"
							>
								<h3 className="text-lg font-bold tc1 mb-2">{dep.name}</h3>
								<p className="tc2 text-sm mb-3 line-clamp-2">{dep.summary}</p>
								<div className="flex items-center justify-between text-xs tc2">
									<span className="flex items-center">
										<Image src="/images/mc/Arrow.png" alt="Downloads" width={16} height={16} className="mr-1 pixelated" />
										{dep.downloadCount.toLocaleString()}
									</span>
									<span className="text-green-500 hover:text-green-400">View Mod →</span>
								</div>
							</a>
						))}
					</div>
				)}
			</section>*/}

		</div>
	);
}
