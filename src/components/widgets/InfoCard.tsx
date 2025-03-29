// InfoCard.tsx
// node.js react typescript tailwindcss
// displays images and text and links in a clean elegant format
// takes
// - title: title string
// - summary: string
// - style: style object
// - className: className string
// - children: ReactNode
// - image: background image location

// states
// - idle: default state, displays title, summary background and expand karat in the top right corner
// - hover: widget expands slightly vertically and the karat wiggles
// - click: widget expands fully to the height of the children while summary fades out, delays 0.1s then the children fade in, on blur returns to idle state

import React, { useState, ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoCardProps {
	title: string;
	summary: string;
	style?: React.CSSProperties;
	className?: string;
	children: ReactNode;
	image?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
	title,
	summary,
	style,
	className = '',
	children,
	image,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [isFaded, setIsFaded] = useState(false);
	const fadedTimerRef = React.useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!isExpanded) {
			setIsFaded(false);
			return;
		}
		if (fadedTimerRef.current) {
			clearTimeout(fadedTimerRef.current);
		}
		fadedTimerRef.current = setTimeout(() => {
			setIsFaded(true);
		}, 400); // Delay before fading out the summary
	}, [isExpanded]);

	const handleClick = () => {
		setIsExpanded(!isExpanded);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<motion.div
			className={`relative overflow-hidden rounded-lg shadow-lg bg2 ${className}`}
			style={style}
			initial={{ height: 'auto' }}
			animate={{
				height: isExpanded ? 'auto' : isHovered ? '130px' : '120px',
				transition: { duration: 0.3 }
			}}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onBlur={(e) => {
				// Only collapse if focus is moving outside the component
				if (!e.currentTarget.contains(e.relatedTarget as Node)) {
					setIsExpanded(false);
				}
			}}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			role="button"
			aria-expanded={isExpanded}
		>
			{image && (
				<div className="absolute inset-0 z-0 opacity-20">
					<Image
						src={image}
						alt={title}
						fill
						style={{ objectFit: 'cover', objectPosition: 'center top', filter: isExpanded? 'blur(4px)' : 'blur(0px)', transition: 'filter 0.4s 0.3s ease-in-out' }}
					/>
				</div>
			)}

			<div className="relative z-10 p-6 pt-3 h-full flex flex-col">
				<div className="absolute top-1 right-1 z-20 flex items-center justify-center w-8 h-8 rounded-full">
					<motion.div
						animate={{
							rotate: isExpanded ? 180 : 0,
							y: isHovered && !isExpanded ? [0, -3, 0, -3, 0] : 0
						}}
						transition={{
							rotate: { duration: 0.3 },
							y: { duration: 0.5, repeat: isHovered && !isExpanded ? Infinity : 0 }
						}}
						className="text-sm tc2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5"
						>
							<path
								fillRule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clipRule="evenodd"
							/>
						</svg>
					</motion.div>
				</div>

				<AnimatePresence>
					{!isExpanded && (
						<motion.div
							initial={{ opacity: 0, maxHeight: '0px', marginTop: '0px', transform: 'translateY(-50px)' }}
							animate={{ opacity: 1, maxHeight: '0px', marginTop: '0px', transform: 'translateY(0px)' }}
							exit={{ opacity: 0, maxHeight: '0px', marginTop: '0px' }}
							transition={{ duration: 0.5 }}
							className="tc2"
						>
							<h2 className="text-xl font-semibold mb-2 tc1">{title}</h2>
							{summary}
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: isFaded ? 1 : 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

export default InfoCard;