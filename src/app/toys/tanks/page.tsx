'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';
import Discussion from '@/components/messages/Discussion';
import Image from 'next/image';
import Social from './social';
import { GiTank, GiBoltShield, GiCrossedSwords, GiRocket } from 'react-icons/gi';
import { FaGamepad, FaMousePointer, FaTrophy, FaBook, FaExpand, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { MdSportsEsports } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';


import { Client, Room } from '@colyseus/sdk'
const TANKS_SERVER_ENDPOINT = "192.168.1.185:2567";

const TankGame = dynamic(() => import('./tankgame/TankGame'), {
	ssr: false,
	loading: () => <LoadingSpinner className="h-full" text="Loading Tank Game..." size="lg" />,
});

const baseThreadID = "tank-game-discussions";

const tokenStateToTitle = {
	'no-token': 'Not logged in',
	'verifying': 'Verifying token...',
	'valid': 'Connected',
	'invalid': 'Token invalid',
}
const tokenStateToColor = {
	'no-token': 'gray',
	'verifying': 'yellow',
	'valid': 'green',
	'invalid': 'red',
};

export default function TanksPage() {

	const { username, isLoggedIn, getSubToken } = useAuth();

	const [gameKey, setGameKey] = useState(0);
	const [gameToken, setGameToken] = useState<string | null>(null);
	const [gameTokenState, setGameTokenState] = useState<'no-token' | 'verifying' | 'valid' | 'invalid'>('no-token');
	const [client, setClient] = useState<Client | null>(null);

	// Fetch token on mount and when login state changes
	useEffect(() => {
		const fetchToken = async () => {
			if (isLoggedIn) {
				const token = await getSubToken('tank-game');
				if (token !== null) {
					setGameToken(token);
				}
			}
		};
		fetchToken();
	}, [isLoggedIn]);

	useEffect(() => {

		verifyGameToken(gameToken).then(isValid => {
			if (isValid) connectColyseus();
		});
	}, [gameToken]);

	const verifyGameToken = async (token: string | null): Promise<boolean> => {

		if (token === null) {
			setGameTokenState('no-token');
			return false;
		} else if (!username) {
			setGameTokenState('invalid');
			return false;
		} else {
			setGameTokenState('verifying');
		}


		try {
			const response = await fetch('/.netlify/functions/auth/verify-sub-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					subToken: token,
					category: 'tank-game',
				}),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setGameTokenState('valid');
					return true;
				} else {
					setGameTokenState('invalid');
					return false;
				}
			} else {
				setGameTokenState('invalid');
				return false;
			}
		} catch (error) {
			console.error('Error verifying game token:', error);
			setGameTokenState('invalid');
			return false;
		}
	};

	const reloadGame = () => {
		setGameKey(prev => prev + 1);
	}

	const connectColyseus = async () => {
		setClient(new Client(`http://${TANKS_SERVER_ENDPOINT}`));
	}

	return (
		<div className="w-full min-h-screen pb-100">
			<div className="fixed w-[100vw] h-[100vh] -z-2">
				<Image	
					src="/KH_back.svg"
					alt="Nebula Background"
					fill
					className="object-cover object-center opacity-30 dark:opacity-60 select-none pointer-events-none"
				/>
			</div>
			{/* Hero Section */}
			<section className="relative p-3 max-w-7xl mx-auto">
				<div className="bg1 relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-3xl p-8 shadow-lg border border-blue-500/20 overflow-hidden">
					<Image
						src="/KH_figures.svg"
						alt=""
						className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-soft-light dark:opacity-30 dark:invert select-none pointer-events-none"
						width={100}
						height={100}
					/>
					<div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
						<div className="flex-grow">
							<h1 className="text-4xl md:text-5xl font-bold mb-4 tc1 flex items-center gap-3">
								<GiTank className="text-5xl" />
								<span>Tanks <span className="text-lg font-normal tc3">multiplayer</span></span>
							</h1>
							<p className="text-xl tc2 mb-4">
								Based off a formative flash game from my childhood
								<a className="mx-1 font-bold hover:opacity-70 text-blue-600 dark:text-blue-400" href="https://www.mathsisfun.com/games/tanks.html" target='_blank' rel="noopener noreferrer">TANKS</a>
								I built this to be as faithful as possible, including all the charming early internet jank.
								<br/>
								I added online multiplayer functionality with a self hosted Colyseus server so you can play with your friends!
								<br />
								<span className='tc1 font-bold'>NOT MOBILE FRIENDLY</span>
							</p>
							<div className="flex flex-wrap gap-4">
								<div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
									<IoMdPeople className="text-xl" />
									<span className="tc1 font-bold">Multiplayer</span>
								</div>
								<div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
									<GiBoltShield className="text-xl" />
									<span className="tc1 font-bold">Turn-Based Action</span>
								</div>
								<div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
									<FaTrophy className="text-xl" />
									<span className="tc1 font-bold">Competitive</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Game Section with Social Sidebar */}
			<section className="p-3 max-w-[2000px] mx-auto">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
					{/* Game Area */}
					<div className={`flex-grow bg2 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden aspect-[64/52] max-h-[90vh]`}>
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<h2 className="text-2xl font-bold tc1 flex items-center">

								<MdSportsEsports className={`mr-2 transition-all duration-400 ${`text-${tokenStateToColor[gameTokenState]}-500`}`}
									title={tokenStateToTitle[gameTokenState]} />
								<span>Tanks <span className="ml-2 text-sm font-normal tc2">Multiple terrains, multiple weapons - get them before they get you!</span></span>
								<div className="ml-auto flex items-center gap-2">

									<FaArrowRotateRight className="cursor-pointer text-xl tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform" onClick={reloadGame} />
								</div>
							</h2>
						</div>
						<div key={gameKey} className="h-[calc(100%-4rem)]">
							<TankGame />
						</div>
					</div>

					{/* Social Sidebar */}
					<div className="w-content flex-shrink-0 lg:max-h-[790px] lg:min-h-[790px]" >
						<Social username={username} isLoggedIn={isLoggedIn} subToken={gameToken} client={client} />
					</div>
				</div>
			</section>

			{/* How to Play Section */}
			<section className="p-3 max-w-7xl mx-auto">
				<div className="bg2 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 ">
					<h2 className="text-3xl font-bold mb-6 tc1 flex items-center gap-3">
						<FaBook />
						How to Play
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-xl">
							<h3 className="text-xl font-bold tc1 mb-3 flex items-center gap-2">
								<FaGamepad />
								Controls
							</h3>
							<table className="tc3 w-full">
								<tbody >
									<tr className="border-b-3 border-gray-300/50 dark:border-gray-700/50">
										<td className="flex gap-1 items-center"><FaArrowLeft className="font-bold tc2 mt-1"/><FaArrowRight className="font-bold tc2 mt-1"/></td>
										<td >Move tank</td>
									</tr>
									<tr className="border-b-3 border-gray-300/50 dark:border-gray-700/50">
										<td className="flex gap-1 items-center"><FaArrowUp className="font-bold tc2 mt-1"/><FaArrowDown className="font-bold tc2 mt-1"/></td>
										<td >Aim Cannon</td>
									</tr>
									<tr className="border-b-3 border-gray-300/50 dark:border-gray-700/50">
										<td ><span className="font-bold tc2">Page Up/Dn</span> or <span className="font-bold tc2">W/S</span></td>
										<td >Adjust Power</td>
									</tr>
									<tr className="border-b-3 border-gray-300/50 dark:border-gray-700/50">
										<td ><span className="font-bold tc2">A/D</span></td>
										<td >Switch Weapon</td>
									</tr>
									<tr>
										<td ><span className="font-bold tc2">Space</span></td>
										<td >FIRE!!</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl">
							<h3 className="text-xl font-bold tc1 mb-3 flex items-center gap-2">
								<GiCrossedSwords />
								Objectives
							</h3>
							<ul className="tc2 space-y-2">
								<li>• Eliminate enemy tanks</li>
								<li>• Capture control points</li>
								<li>• Work with your team</li>
								<li>• Top the leaderboard</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Discussion Section */}
			<section className="p-3 max-w-7xl mx-auto mb-12">
				<div className="bg2 p-4 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg">
					<Discussion 
						baseThreadID={baseThreadID} 
						baseThreadTitle="Tank Game Discussions" 
						baseThreadContent="Share your strategies, find teammates, and discuss the game here!" 
					/>
				</div>
			</section>
		</div>
	);
}
