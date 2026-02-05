import Phaser from 'phaser';

export type TerrainType = 'desert' | 'forest' | 'mountains' | 'city' | 'none';

export class Terrain {
	private scene: Phaser.Scene;
	private graphics!: Phaser.GameObjects.Graphics;
	//private bodies: MatterJS.BodyType[] = [];
	public points: Phaser.Math.Vector2[] = [];
	private currentType: TerrainType = 'desert';
	private showDebug: boolean;

	private sunbeamRenderer!: Phaser.GameObjects.Graphics;
	private sunbeamTime: number = 3000; // milliseconds
	private aniFrac: number = 0;

	private windSpeed: number = 20; // pixels per second
	private cloudImages: Phaser.GameObjects.Image[] = [];
	private cloudBrightness: Phaser.FX.ColorMatrix[] = [];
	private cloudDepth: number[] = [];
	private cloudCount = 20;

	public genGap:number = 3; // pixels between terrain points
	//private segmentSize = 5; // number of points per terrain physics segment

	private colorMap: Record<TerrainType, number> = {
		'desert': 0xeaddb5,
		'forest': 0x78ab00,
		'mountains': 0xFFFFFF,
		'city': 0x181830,
		'none': 0xff00ff
	};

	private backgroundFilepaths: Record<TerrainType, string> = {
		'desert': '/tanks/bg/desert.svg',
		'forest': '/tanks/bg/forest.svg',
		'mountains': '/tanks/bg/mountains.svg',
		'city': '/tanks/bg/city.svg',
		'none': '/tanks/bg/none.svg'
	};

	private backgroundImages: Record<TerrainType, Phaser.GameObjects.Image | null> = {
		'desert': null,
		'forest': null,
		'mountains': null,
		'city': null,
		'none': null
	};

	constructor(scene: Phaser.Scene, showDebug: boolean = false, initialTerrain: TerrainType = 'desert') {
		this.scene = scene;
		this.showDebug = showDebug;
		this.currentType = initialTerrain;
	}

	private treeImages: Phaser.GameObjects.Image[] = [];
	private treeFilepaths: Record<TerrainType, string | null> = {
		'desert': null,
		'forest': '/tanks/props/forest-tree.svg',
		'mountains': '/tanks/props/mountain-tree.svg',
		'city': null,
		'none': null
	};
	private treeDensities: Record<TerrainType, number> = {
		'desert': 0,
		'forest': 20,
		'mountains': 10,
		'city': 0,
		'none': 0
	};

	private sunPositions: Record<TerrainType, Phaser.Math.Vector2> = {
		'desert': new Phaser.Math.Vector2(160, 430),
		'forest': new Phaser.Math.Vector2(1000, 170),
		'mountains': new Phaser.Math.Vector2(970, 250),
		'city': new Phaser.Math.Vector2(880, 600),
		'none': new Phaser.Math.Vector2(600, 450)
	};
	private sunImage: Phaser.GameObjects.Image | null = null;
	private skyImage: Phaser.GameObjects.Image | null = null;

	preload() {
		for (const terrain in this.backgroundFilepaths) {
			const imagePath = this.backgroundFilepaths[terrain as TerrainType];
			this.scene.load.image(terrain, imagePath);
		}
		this.scene.load.image('sun', '/tanks/props/sun.svg');
		this.scene.load.image('sky', '/tanks/bg/sky.svg')
		this.scene.load.image('cloud', '/tanks/props/cloud.svg');
		for (const terrain in this.treeFilepaths) {
			const treePath = this.treeFilepaths[terrain as TerrainType];
			if (treePath) {
				this.scene.load.image(terrain + '-tree', treePath);
			}
		}
	}

	//depths in order
	// 0: sky
	// 1.2: clouds
	// 1.5: sunbeams
	// 2: sun
	// 3: background
	// 4: terrain
	// 5: trees

	create() {
		console.log('Creating terrain');
		// Create graphics object here
		this.graphics = this.scene.add.graphics();
		this.graphics.setDepth(4); // Ensure graphics render on top

		this.sunbeamRenderer = this.scene.add.graphics();
		this.sunbeamRenderer.setDepth(1.5); // Right behind sun

		// Add tween for sunbeam animation
		this.scene.tweens.add({
			targets: this,
			aniFrac: 1,
			duration: this.sunbeamTime,
			yoyo: false,
			repeat: -1,
			ease: 'Linear'
		});

		// Add background images
		for (const terrain in this.backgroundFilepaths) {
			this.backgroundImages[terrain as TerrainType] = this.scene.add.image(600, 450, terrain);
			this.backgroundImages[terrain as TerrainType]?.setDepth(3); // Render behind everything
		}

		// Add backgrounds
		this.skyImage = this.scene.add.image(600, 450, 'sky');
		this.skyImage.setDepth(1); // Render behind everything


		// Add sun image
		this.sunImage = this.scene.add.image(0, 0, 'sun');
		this.sunImage.setDepth(2); // Render below behind everything but sky

		// Add clouds
		for (let i = 0; i < this.cloudCount; i++) {
			const cloud = this.scene.add.image(100, 100, 'cloud');
			cloud.setDepth(1.2); // Render above sky but below sun
			this.cloudBrightness.push(cloud.postFX.addColorMatrix());
			this.cloudImages.push(cloud);
		}


		// Initialize with default terrain
		this.switchTerrain(this.currentType);
	}

	update() {
		// Update sunbeam effect using tweened aniFrac
		const radius = 60 + 80 * this.aniFrac;
		const opacity = 1 - Math.abs(this.aniFrac * 2 - 1);
		this.sunbeamRenderer.clear();
		if (this.sunImage) {
			this.sunbeamRenderer.fillStyle(0xffff99, 0.2 * opacity);
			this.sunbeamRenderer.fillCircle(this.sunImage.x, this.sunImage.y, radius);
		}

		// move clouds and loop
		for (let i = 0; i < this.cloudImages.length; i++) {
			const cloud = this.cloudImages[i];
			cloud.x += (this.windSpeed * (1000 / this.cloudDepth[i])) * (this.scene.game.loop.delta / 1000);
			if (cloud.x > 1500) {
				cloud.x = -300;
			}
			if (cloud.x < -300) {
				cloud.x = 1500;
			}
		}

	}

	switchTerrain(newTerrain: TerrainType) {
		console.log(`Switching to terrain: ${newTerrain}`);
		this.currentType = newTerrain;
		this.points = this.generateTerrain(this.currentType);


		// Update background visibility
		for (const terrain in this.backgroundImages) {
			this.backgroundImages[terrain as TerrainType]?.setVisible(terrain === this.currentType);
		}
		this.updateTerrain();
		// Distribute trees 
		let treeCount = Math.floor(this.treeDensities[this.currentType] * Phaser.Math.FloatBetween(0.8, 1.2));
		
		this.distributeTrees(treeCount, 1200, this.currentType);
		this.floorTrees();

		// Distribute clouds
		this.distributeClouds(this.currentType);

		// Position sun
		if (this.sunImage) {
			const sunPos = this.sunPositions[this.currentType];
			this.sunImage.setPosition(sunPos.x, sunPos.y);
		}

		
	}
	
	//depth 2.5, 3.5, 6
	private depthLayers: number[] = [2.5, 3.5, 6];
	
	private distributeClouds(type: TerrainType) {
		switch (type) {
			case 'desert':
				this.windSpeed = Phaser.Math.Between(10, 30) * (Phaser.Math.Between(0,1) < 0.5 ? -1 : 1);
				for (let i = 0; i < this.cloudImages.length; i++) {
					this.cloudDepth[i] = Phaser.Math.FloatBetween(400, 1500);
					const cloud = this.cloudImages[i];
					cloud.setVisible(i <= 5);
					this.cloudBrightness[i].brightness(Phaser.Math.FloatBetween(1.3, 1.5));
					cloud.setPosition(Phaser.Math.Between(-300, 1500), 800 - (Phaser.Math.Between(300, 500) * 500 / this.cloudDepth[i]));
					cloud.setAlpha(Math.min(0.8, (500 / this.cloudDepth[i]) ** 2));
					cloud.setScale(Phaser.Math.FloatBetween(0.9, 1.1) * (700 / this.cloudDepth[i]));
					let layer = this.depthLayers.length - 1 - Math.floor(((this.cloudDepth[i] - 400) / 1100)**0.5 * this.depthLayers.length );
					layer = Math.min(this.depthLayers.length - 1, Math.max(0, layer));
					cloud.setDepth(this.depthLayers[layer]);
				}
				break;
			case 'forest':
				this.windSpeed = Phaser.Math.Between(5, 40) * (Phaser.Math.Between(0,1) < 0.5 ? -1 : 1);
				for (let i = 0; i < this.cloudImages.length; i++) {
					this.cloudDepth[i] = (Phaser.Math.FloatBetween(0, 1)**0.9)*1200 +300;
					const cloud = this.cloudImages[i];
					cloud.setVisible(i <= 15);
					this.cloudBrightness[i].brightness(Phaser.Math.FloatBetween(0.85, 1.1));
					cloud.setPosition(Phaser.Math.Between(-300, 1500), 800 - (Phaser.Math.Between(300, 500) * 500 / this.cloudDepth[i]));
					cloud.setAlpha(Math.min(0.8, (500 / this.cloudDepth[i]) ** 2));
					cloud.setScale(Phaser.Math.FloatBetween(0.9, 1.1) * (700 / this.cloudDepth[i]));
					let layer = this.depthLayers.length - 1 - Math.floor(((this.cloudDepth[i] - 400) / 1100) ** 0.5 * this.depthLayers.length);
					layer = Math.min(this.depthLayers.length - 1, Math.max(0, layer));
					cloud.setDepth(this.depthLayers[layer]);
				}
				break;
			case 'mountains':
				this.windSpeed = Phaser.Math.Between(15, 90) * (Phaser.Math.Between(0, 1) < 0.5 ? -1 : 1);
				for (let i = 0; i < this.cloudImages.length; i++) {
					this.cloudDepth[i] = (Phaser.Math.FloatBetween(0, 1) ** 1.2) * 1200 + 300;
					const cloud = this.cloudImages[i];
					cloud.setVisible(i <= 15);
					this.cloudBrightness[i].brightness(Phaser.Math.FloatBetween(0.95, 1.05));
					cloud.setPosition(Phaser.Math.Between(-300, 1500), 800 - (Phaser.Math.Between(300, 500) * 500 / this.cloudDepth[i]));
					cloud.setAlpha(Math.min(0.8, (500 / this.cloudDepth[i]) ** 2));
					cloud.setScale(Phaser.Math.FloatBetween(0.9, 1.1) * (700 / this.cloudDepth[i]));
					let layer = this.depthLayers.length - 1 - Math.floor(((this.cloudDepth[i] - 400) / 1100) ** 0.5 * this.depthLayers.length);
					layer = Math.min(this.depthLayers.length - 1, Math.max(0, layer));
					cloud.setDepth(this.depthLayers[layer]);
				}
				break;
			case 'city':
				this.windSpeed = Phaser.Math.Between(0, 15) * (Phaser.Math.Between(0, 1) < 0.5 ? -1 : 1);
				for (let i = 0; i < this.cloudImages.length; i++) {
					this.cloudDepth[i] = (Phaser.Math.FloatBetween(0, 1) ** 1.2) * 1200 + 300;
					const cloud = this.cloudImages[i];
					cloud.setVisible(i <= 10);
					this.cloudBrightness[i].brightness(Phaser.Math.FloatBetween(0.2, 0.4));
					cloud.setPosition(Phaser.Math.Between(-300, 1500), 800 - (Phaser.Math.Between(300, 500) * 500 / this.cloudDepth[i]));
					cloud.setAlpha(Math.min(0.8, (300 / this.cloudDepth[i]) ** 2));
					cloud.setScale(Phaser.Math.FloatBetween(0.9, 1.1) * (700 / this.cloudDepth[i]));
					let layer = this.depthLayers.length - 1 - Math.floor(((this.cloudDepth[i] - 400) / 1100) ** 0.5 * this.depthLayers.length);
					layer = Math.min(this.depthLayers.length - 1, Math.max(0, layer));
					cloud.setDepth(this.depthLayers[layer]);
				}
				break;
		}
	}

	private distributeTrees(count: number, width: number, type: TerrainType) {
		// Clear existing trees
		this.treeImages.forEach(tree => tree.destroy());
		this.treeImages = [];

		if (!this.treeFilepaths[type]) return;
		
		const treeXPositions: number[] = [];
		while (treeXPositions.length < count) {
			const x = Phaser.Math.Between(0, width);
			// Ensure trees are not too close to each other
			if (!treeXPositions.some(existingX => Math.abs(existingX - x) < 10)) {
				treeXPositions.push(x);
			}
		}
		
		// Add new trees
		treeXPositions.forEach(x => {
			// Find corresponding y on terrain
			const terrainPoint = this.points.find(pt => Math.abs(pt.x - x) < 5);
			if (terrainPoint) {
				const tree = this.scene.add.image(x, terrainPoint.y - 20, type + '-tree');
				tree.setDepth(5); // Ensure trees render above terrain
				this.treeImages.push(tree);
			}
		});

	}

	private floorTrees(x: number = 600, radius: number = 600) {
		this.treeImages.forEach(tree => {
			if (Math.abs(tree.x - x) > radius) return;
			// Find corresponding y on terrain
			const terrainPoint = this.points.find(pt => Math.abs(pt.x - tree.x) < 5);
			if (terrainPoint) {
				tree.y = terrainPoint.y - 20;
			}
		});
	}

	public updateTerrain() {
		/*
		// Destroy old terrain bodies
		const matterScene = this.scene as Phaser.Scene & { matter: Phaser.Physics.Matter.MatterPhysics };
		this.bodies.forEach(body => {
			matterScene.matter.world.remove(body);
		});
		this.bodies = [];

		// Create multiple small segments for accurate collision
		const vertices = this.points.slice(0, -2); // Exclude the bottom corners
		for (let i = 0; i < vertices.length - 1; i += this.segmentSize) {
			const segmentVerts = [];
			const endIndex = Math.min(i + this.segmentSize + 1, vertices.length);

			// Add terrain surface points
			for (let j = i; j < endIndex; j++) {
				segmentVerts.push({ x: vertices[j].x, y: vertices[j].y });
			}

			// Close the segment with bottom points
			segmentVerts.push({ x: vertices[endIndex - 1].x, y: 900 });
			segmentVerts.push({ x: vertices[i].x, y: 900 });

			// calculate centeroid
			let centroidX = segmentVerts.reduce((sum, v) => sum + v.x, 0);
			let centroidY = segmentVerts.reduce((sum, v) => sum + v.y, 0);
			centroidX /= segmentVerts.length;
			centroidY /= segmentVerts.length;

			// Create body using fromVertices with auto-positioning disabled
			const body = (matterScene.matter as any).body.create({
				position: { x: centroidX, y: centroidY },
				vertices: segmentVerts,
				isStatic: true
			});

			matterScene.matter.world.add(body);
			this.bodies.push(body);
		}
		*/
		this.graphics.clear();

		// Draw void below terrain
		const voidHeight = 2;
		this.graphics.fillStyle(0x0000ff, 1);
		this.graphics.fillRect(0, this.scene.scale.height - voidHeight, this.scene.scale.width, voidHeight);
		//console.log(`width: ${this.scene.scale.width}, height: ${this.scene.scale.height}`);

		// Draw terrain
		this.graphics.fillStyle(this.colorMap[this.currentType], 1);
		this.graphics.fillPoints(this.points, true);

		
		// Draw debug collision outline
		/*if (this.showDebug) {
			this.graphics.lineStyle(1, 0xff0000, 0.5);
			this.bodies.forEach(body => {
				const vertices = (body as any).vertices;
				if (vertices && vertices.length > 0) {
					this.graphics.beginPath();
					this.graphics.moveTo(vertices[0].x, vertices[0].y);
					for (let i = 1; i < vertices.length; i++) {
						this.graphics.lineTo(vertices[i].x, vertices[i].y);
					}
					this.graphics.closePath();
					this.graphics.strokePath();
				}
			});
		}*/

	}

	private phaseArray2Terrain(phasorArray: { amplitude: number, frequency: number, phase: number }[], width: number = 1200, height: number = 900, offset: number = 100): Phaser.Math.Vector2[] {
		const newTerrain: Phaser.Math.Vector2[] = [];
		let maxY = 0;
		let minY = 0;
		for (let x = 0; x < width+this.genGap; x += this.genGap) {
			let y = 0;
			for (const phasor of phasorArray) {
				y += phasor.amplitude * Math.sin(phasor.frequency * (x * 2 * Math.PI / width) + phasor.phase);
			}
			maxY = Math.max(maxY, y);
			minY = Math.min(minY, y);
			newTerrain.push(new Phaser.Math.Vector2(x, y));
		}
		// Normalize y values if the range is too large
		const topGap = 150
		let scale = 1;
		const yRange = maxY - minY;
		if (yRange > height - offset * 2 - topGap) {
			scale = (height - offset * 2 - topGap) / yRange;
			console.log('Scaling terrain by', scale);
			offset = offset * scale;
		}

		for (let i = 0; i < newTerrain.length; i++) {
			newTerrain[i].y = newTerrain[i].y * scale + (height - maxY * scale) - offset; // Offset from bottom
		}
		newTerrain.push(new Phaser.Math.Vector2(width, height));
		newTerrain.push(new Phaser.Math.Vector2(0, height));
		return newTerrain;
	}

	private generateTerrain(terrainType: TerrainType, width: number = 1200, height: number = 900): Phaser.Math.Vector2[] {
		switch (terrainType) {
			case 'desert':
				const phasorArray: { amplitude: number, frequency: number, phase: number }[] = [];
				for (let i = 0; i <= 4; i++) {
					phasorArray.push({
						amplitude: Phaser.Math.Between(10, 30) / (1.2 ** i),
						frequency: 1.3 ** i,
						phase: Phaser.Math.FloatBetween(0, Math.PI * 2)
					});
				}
				return this.phaseArray2Terrain(phasorArray, width, height, 30);
				//const terrainArray: Phaser.Math.Vector2[] = [];
				//for (let x = 0; x < width + this.genGap; x += this.genGap) {
				//	terrainArray.push(new Phaser.Math.Vector2(x, 800 - x / 5))
				//}
				//terrainArray.push(new Phaser.Math.Vector2(width, height));
				//terrainArray.push(new Phaser.Math.Vector2(0, height));
				//return terrainArray;
			case 'forest':
				const forestPhasorArray: { amplitude: number, frequency: number, phase: number }[] = [];
				for (let i = 0; i <= 9; i++) {
					forestPhasorArray.push({
						amplitude: Phaser.Math.Between(15, 60) / (1.3 ** i),
						frequency: 1.3 ** i,
						phase: Phaser.Math.FloatBetween(0, Math.PI * 2)
					});
				}
				return this.phaseArray2Terrain(forestPhasorArray, width, height, 230);
			case 'mountains':
				const mountainPhasorArray: { amplitude: number, frequency: number, phase: number }[] = [];
				for (let i = 0; i <= 8; i++) {
					mountainPhasorArray.push({
						amplitude: Phaser.Math.Between(10, 400) / (1.5 ** i),
						frequency: 1.3 ** i,
						phase: Phaser.Math.FloatBetween(0, Math.PI * 2)
					});
				}
				return this.phaseArray2Terrain(mountainPhasorArray, width, height, 20);
			default:
				const cityPhasorArray: { amplitude: number, frequency: number, phase: number }[] = [{ amplitude: Phaser.Math.FloatBetween(0.3, 0.6), frequency: Phaser.Math.FloatBetween(50, 100), phase: Phaser.Math.FloatBetween(0, Math.PI * 2) }];
				for (let i = 0; i <= 2; i++) {
					cityPhasorArray.push({
						amplitude: Phaser.Math.FloatBetween(0.2, 0.8),
						frequency: 2 ** i * 5,
						phase: Phaser.Math.FloatBetween(0, Math.PI * 2)
					});
				}
				return this.phaseArray2Terrain(cityPhasorArray, width, height, 50);
		}
	}

	getCurrentType(): TerrainType {
		return this.currentType;
	}

	getWindSpeed(): number {
		return this.windSpeed;
	}

	setWindSpeed(newSpeed: number) {
		this.windSpeed = newSpeed;
	}

	randomizeWindSpeed() {
		this.windSpeed = (this.windSpeed * Phaser.Math.FloatBetween(0.9, 1.1)) +  Phaser.Math.FloatBetween(-2, 2);
	}

	damageTerrain(x: number, y: number, radius: number, roughness: number = 0.05, power: number = 1) {
		const powerToDamage = 1-Math.exp(-power / 2);
		// Modify terrain points within radius
		this.points.forEach(pt => {
			const dist = Math.abs(x - pt.x);
			if (dist > radius) return;
			const explosionYMax = y + Math.sqrt(radius * radius - (pt.x - x) * (pt.x - x));
			const explosionYMin = y - Math.sqrt(radius * radius - (pt.x - x) * (pt.x - x));
			if (pt.y > explosionYMin && pt.y < explosionYMax) {
				pt.y += (explosionYMax - pt.y) * Phaser.Math.FloatBetween(1-roughness, 1+ roughness) * powerToDamage;
			}
			if (pt.y < explosionYMin) {
				pt.y += (explosionYMax - explosionYMin) * Phaser.Math.FloatBetween(1 - roughness, 1 + roughness) * powerToDamage;
			}
			pt.y = Math.min(900, pt.y);
		});

		this.updateTerrain();
		this.floorTrees(x, radius);
		
	}
}
