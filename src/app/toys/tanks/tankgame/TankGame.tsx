// src/components/PhaserGame.tsx
'use client'

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { MainScene } from "./scenes/MainScene"
import { ShopScene } from "./scenes/ShopScene"
import { MenuScene } from './scenes/MenuScene'

interface PhaserGameProps {
	width?: number
	height?: number
}

export default function PhaserGame({ width = 1200, height = 900 }: PhaserGameProps) {
	const gameRef = useRef<Phaser.Game | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Only run on client side
		if (typeof window === 'undefined' || gameRef.current) return

		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width,
			height,
			parent: containerRef.current || undefined,
			physics: {
				default: 'matter',
			},
			dom: {
				createContainer: true
			},
			scene: [MenuScene, MainScene, ShopScene],
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH
			}
		}

		gameRef.current = new Phaser.Game(config)

		// Cleanup on unmount
		return () => {
			if (gameRef.current) {
				gameRef.current.destroy(true)
				gameRef.current = null
			}
		}
	}, [width, height])

	return (
		<div
			ref={containerRef}
			className='w-full'
		/>
	)
}