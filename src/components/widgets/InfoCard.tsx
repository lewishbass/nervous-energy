// InfoCard.tsx
// node.js react typescript tailwindcss
// displays images and text and links in a clean elegant format
// takes
// - title: title string
// - summary: string
// - style: style object
// - className: className string
// - children: ReactNode
// - image: background image location or array of image locations
// - onDownload: optional function to download images

import React, { useState, ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload } from 'react-icons/fa6';

interface InfoCardProps {
	title: string;
	summary: string;
	style?: React.CSSProperties;
	className?: string;
	children: ReactNode;
	image?: string | string[];
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
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isFaded, setIsFaded] = useState(false);

	const fadedTimerRef = React.useRef<NodeJS.Timeout | null>(null);
	const imageTransitionRef = React.useRef<NodeJS.Timeout | null>(null);

	// Convert image prop to array for easier handling
	const images = Array.isArray(image) ? image : image ? [image] : [];
	const hasMultipleImages = images.length > 1;

	// Image rotation effect
	useEffect(() => {
		if (images.length <= 1) return;

		const rotateImage = () => {
			setCurrentImageIndex(prev => (prev + 1) % images.length);
		};

		imageTransitionRef.current = setTimeout(rotateImage, 15000);

		return () => {
			if (imageTransitionRef.current) {
				clearTimeout(imageTransitionRef.current);
			}
		};
	}, [currentImageIndex, images.length]);

	const next_image = () => {
		if (images.length <= 1) return;
		if (imageTransitionRef.current) {
			clearTimeout(imageTransitionRef.current);
		}
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	}

	useEffect(() => {
		if (!isExpanded) {
			setIsFaded(false);
			setIsFullscreen(false);
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
		if (isExpanded && hasMultipleImages) {
			// If already expanded and has multiple images, toggle fullscreen mode
			setIsFullscreen(!isFullscreen);
		} else {
		// Otherwise toggle expanded state
			setIsExpanded(!isExpanded);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			setIsExpanded(!isExpanded);
		}
	};
	const downloadImages = async (images: string[]) => {
		try {
			// Import JSZip dynamically
			const JSZip = (await import('jszip')).default;
			const zip = new JSZip();
			const folderName = images[0].split('/').slice(0, -1).pop() || 'cave-photos';

			// Add each image to the zip
			const fetchPromises = images.map(async (image) => {
				const response = await fetch(image);
				const blob = await response.blob();
				const filename = image.split('/').pop() || 'image';
				zip.file(filename, blob);
			});

			await Promise.all(fetchPromises);

			// Generate and download the zip
			const content = await zip.generateAsync({ type: 'blob' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(content);
			link.download = `${folderName}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Failed to download images:', error);
			alert('Failed to download images. Please try again later.');
		}
	};

	return (
		<motion.div
			className={`relative overflow-hidden rounded-lg shadow-lg bg2 ${className}`}
			style={style}
			initial={{ height: 'auto' }}
			animate={{
				height: isFullscreen ? '80vh' : isExpanded ? 'auto' : isHovered ? '145px' : '120px',
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
			{images.length > 0 && (
				<>
					<AnimatePresence>
						<motion.div
							key={currentImageIndex}
							className="absolute inset-0 z-0"
							initial={{ opacity: 0, transform: 'scale(1.05)' }}
							animate={{
								opacity: isFullscreen ? 1 : 0.3,
								transform: 'scale(1)'
							}}
							exit={{ opacity: 0 }}
							transition={{
								duration: 1.5,
								exit: { delay: 1 }
							}}
						>
							<Image
								src={images[currentImageIndex]}
								alt={title}
								fill
								style={{
									objectFit: 'cover',
									objectPosition: 'center top',
									filter: isFullscreen ? 'blur(0px)' : isExpanded ? 'blur(4px)' : 'blur(0px)',
									transition: 'filter 0.4s ease-in-out'
								}}
							/>
						</motion.div>
					</AnimatePresence>
				</>
			)}

			<div className={`relative z-10 p-6 pt-3 h-full flex flex-col ${isFullscreen ? 'opacity-0' : 'opacity-100'}`}
				style={{ transition: 'opacity 0.3s ease-in-out' }}>
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

			{hasMultipleImages && isExpanded && (
				<>
					{isFullscreen ? (
						<div
							className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-100 flex items-center gap-2 cursor-pointer hover:bg-black/90 z-20 select-none"
							style={{ transition: 'background-color 0.3s ease-in-out' }}
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								console.log('Download clicked');
								downloadImages(images);
							}}
						>
							<FaDownload /> Download
						</div>
					) : (
						<div
							className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-60"
							style={{ transition: 'opacity 0.3s ease-in-out' }}
						>
							Click for gallery view
						</div>
					)}
				</>
			)}

			{isFullscreen && (
				<div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full cursor-pointer z-20 text-sm"
					onClick={(e) => { e.preventDefault(); e.stopPropagation(); next_image(); }}>
					{currentImageIndex + 1} / {images.length}
				</div>
			)
			}
		</motion.div>
	);
};

export default InfoCard;