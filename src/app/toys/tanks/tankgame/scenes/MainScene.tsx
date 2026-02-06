// src/game/scenes/MainScene.ts
import Phaser from 'phaser'
import { Terrain, TerrainType } from './MainScene/Terrain'
import { Tank } from './MainScene/Tank'
import { Dashboard } from './MainScene/Dashboard'
import { Projectile } from './MainScene/Projectile'

import { projectilelist } from './MainScene/projectiles/projectilelist';
import { tan } from '@tensorflow/tfjs-core'

export class MainScene extends Phaser.Scene {
	private nTanks: number = 2;
	private tanks: Tank[] = [];
	private turnOrder: number[] = [];
	private currentTurnIndex: number = 0;

	private playerInfo: { name: string; color: string, isAI: boolean, aiDifficulty: string }[] = [];

	private terrain!: Terrain;
	private terrainType: TerrainType | 'random' = 'random';
	private dashboard!: Dashboard;

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private spaceKey!: Phaser.Input.Keyboard.Key;
	private key1!: Phaser.Input.Keyboard.Key;
	private key2!: Phaser.Input.Keyboard.Key;
	private key3!: Phaser.Input.Keyboard.Key;
	private key4!: Phaser.Input.Keyboard.Key;
	private key5!: Phaser.Input.Keyboard.Key;
	private pageUpKey!: Phaser.Input.Keyboard.Key;
	private pageDownKey!: Phaser.Input.Keyboard.Key;
	private wKey!: Phaser.Input.Keyboard.Key;
	private aKey!: Phaser.Input.Keyboard.Key;
	private sKey!: Phaser.Input.Keyboard.Key;
	private dKey!: Phaser.Input.Keyboard.Key;

	private mouseHighlight!: Phaser.GameObjects.Graphics;
	private mouseRad: number = 50;
	private lastMouse: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

	private projectiles: Projectile[] = [];

	private explosions: Phaser.GameObjects.Image[] = [];
	
	private damageNumbers: Phaser.GameObjects.Text[] = [];

	private launchedShop: boolean = false;

	private roundNumber: number = 0;
	private deathOrder: number[] = [];

	private itemNames: string[] = [
		'small_missile', 'missile', 'small_atom_bomb', 'atom_bomb', 'volcano_bomb', 'shower', 'hot_shower', 'small_ball', 'ball', 'large_ball', 'small_ball_v2', 'ball_v2', 'large_ball_v2', 'air_strike', 'parachutes', 'repair_kit', 'fuel', 'weak_shield', 'shield', 'strong_shield', 'super_shield', 'teleport', 'upgrade_energy', 'upgrade_armor', 'upgrade_engine', 'upgrade_hill_mov',
	];
	

	constructor() {
		super({ key: 'MainScene' })
	}

	init(data: { terrain?: string, players?: number, playerInfo?: Array<{ name: string; color: string, isAI: boolean, aiDifficulty: string }> }) {
		// Receive data from menu scene
		if (data.players) {
			this.nTanks = data.players;
		}
		if (data.terrain) {
			// Store terrain preference for create()
			this.registry.set('initialTerrain', data.terrain);
		}
		if (data.playerInfo) {
			this.playerInfo = data.playerInfo;
			console.log('Received player info:', this.playerInfo);
		}
	}


	preload() {


		// Load assets
		this.load.spritesheet('player', '/tanks/props/tank.svg', {
			frameWidth: 32,
			frameHeight: 48,
		})
		this.load.image('health', '/tanks/props/health.svg');
		this.load.image('fuel_dash', '/tanks/props/fuel.svg');
		this.load.image('teleport_dash', '/tanks/props/teleport.svg');
		this.load.image('repair_kit_dash', '/tanks/props/repair_kit.svg');
		this.load.image('parachutes_dash', '/tanks/props/parachutes.svg');
		this.load.image('firebutton', '/tanks/props/fire.svg');
		this.load.image('explosion', '/tanks/props/explosion.svg');


		// load audio
		this.sound.unlock();
		this.load.audio('aim', '/tanks/sounds/aim.mp3');
		this.load.audio('crack', '/tanks/sounds/crack.mp3');
		this.load.audio('bang', '/tanks/sounds/bang.mp3');
		this.load.audio('boom', '/tanks/sounds/boom.mp3');
		this.load.audio('kaboom', '/tanks/sounds/kaboom.mp3');
		this.load.audio('click', '/tanks/sounds/click.mp3');
		this.load.audio('doors', '/tanks/sounds/doors.mp3');
		this.load.audio('fire', '/tanks/sounds/fire.mp3');


		// Load font
		this.load.font('machine-font', '/tanks/mf.otf');

		for (const itemName of this.itemNames) {
			this.load.image(itemName, `/tanks/items/${itemName}.svg`);
		}

		
		// Preload terrain assets
		this.terrainType = this.registry.get('initialTerrain') || 'random';
		if (this.terrainType === 'random') {
			this.terrain = new Terrain(this, true, Phaser.Utils.Array.GetRandom(['desert', 'forest', 'mountains', 'city']));
		} else {
			this.terrain = new Terrain(this, true, this.terrainType as TerrainType);
		}
		this.terrain.preload();
	}

	create() {
		//console.log('MainScene create() called');
		this.mouseHighlight = this.add.graphics();
		this.mouseHighlight.setDepth(20);
		
		// Create terrain
		this.terrain.create();
		
		

		// Create tank instead of player sprite (with debug enabled)
		for (let i = 0; i < this.nTanks; i++) {
			console
			const color = this.playerInfo[i]?.color ? Phaser.Display.Color.HexStringToColor(this.playerInfo[i].color).color : 0xff00ff;
			this.tanks.push(new Tank(this, -200, -200, false, this.terrain, this.playerInfo[i]?.name || `Tank ${i + 1}`, this.projectiles, color));
		}
		
		
		
		this.distributeTanks();

		// Determine turn order
		this.turnOrder = Phaser.Utils.Array.NumberArray(0, this.nTanks - 1) as number[];
		Phaser.Utils.Array.Shuffle(this.turnOrder);
		//console.log('Turn order:', this.turnOrder);

		// Create dashboard
		this.dashboard = new Dashboard(this);
		
		// Connect dashboard movement buttons
		this.dashboard.onMoveLeft = () => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			currentTank.move(this.game.loop.delta, -1);
		};
		this.dashboard.onMoveRight = () => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			currentTank.move(this.game.loop.delta, 1);
		};
		this.dashboard.onFire = () => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			currentTank.fire(this.terrain.getWindSpeed());
			this.currentTurnIndex = (this.currentTurnIndex + 1) % this.nTanks;
		};
		this.dashboard.onPowerChange = (fraction: number) => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			const maxPower = 100;
			currentTank.adjustPower(fraction * maxPower - currentTank.power);
		};
		this.dashboard.onAngleChange = (angle: number) => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			currentTank.rotateTurret(angle - currentTank.turretAngle);

		};
		this.dashboard.onWeaponScroll = (delta: number) => {
			const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			currentTank.scrollWeaponSelection(delta);
		};


		// Initialize cursor keys and space key once
		this.cursors = this.input.keyboard!.createCursorKeys();
		this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.key1 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
		this.key2 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
		this.key3 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
		this.key4 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
		this.key5 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
		this.pageUpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_UP);
		this.pageDownKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN);
		this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		// Add click event to damage terrain
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
			// this.explosionAt(worldPoint.x, worldPoint.y, 4, this.mouseRad);
			// this.projectiles.push(new projectilelist['missile'](this, worldPoint.x, worldPoint.y, 0, 0, this.terrain.getWindSpeed()));
			// this.distributeTanks();
			// Temporary: Open shop on click
			//this.scene.launch('ShopScene', { callingScene: this, tanks: this.tanks});
		});

		// highlight collision on mouse move
		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
			this.mouseHighlight.clear();
			//this.mouseHighlight.lineStyle(2, 0xffff00, 1);
			//this.mouseHighlight.strokeCircle(worldPoint.x, worldPoint.y, this.mouseRad);
			this.lastMouse.set(worldPoint.x, worldPoint.y);
		});

		this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
			this.mouseRad = Phaser.Math.Clamp(this.mouseRad + deltaY / 100, 10, 200);
			//this.mouseHighlight.clear();
			//this.mouseHighlight.lineStyle(2, 0xffff00, 1);
			//this.mouseHighlight.strokeCircle(this.lastMouse.x, this.lastMouse.y, this.mouseRad);
		});

		// Listen for resume event to start a new round
		this.events.on('resume', () => {
			this.newRound();
			this.launchedShop = false;
		});
	}
	
	update() {
		
		// Handle terrain switching with key press detection
		if (Phaser.Input.Keyboard.JustDown(this.key1)) {
			this.terrain.switchTerrain('desert');
			this.distributeTanks();
			this.clearProjectiles();
		}
		if (Phaser.Input.Keyboard.JustDown(this.key2)) {
			this.terrain.switchTerrain('forest');
			this.distributeTanks();
			this.clearProjectiles();
		}
		if (Phaser.Input.Keyboard.JustDown(this.key3)) {
			this.terrain.switchTerrain('mountains');
			this.distributeTanks();
			this.clearProjectiles();
		}
		if (Phaser.Input.Keyboard.JustDown(this.key4)) {
			this.terrain.switchTerrain('city');
			this.distributeTanks();
			this.clearProjectiles();
		}
		if (Phaser.Input.Keyboard.JustDown(this.key5)) {
			this.newRound();
		}
		// Handle space key for terrain regeneration or firing
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			const tank = this.tanks[this.turnOrder[this.currentTurnIndex]];
			tank.fire(this.terrain.getWindSpeed());
			this.currentTurnIndex = (this.currentTurnIndex + 1) % this.nTanks;
		}

		// check if all or all but one are dead
		const aliveTanks = this.tanks.filter(tank => tank.alive);
		if (aliveTanks.length <= 1 && !this.launchedShop) {
			// round over
			this.endRound(aliveTanks[0]);
		}

		// skip turn if dead
		for (let i = 0; i < this.nTanks; i++) {
			if (this.tanks[this.turnOrder[this.currentTurnIndex]].alive) break;
			this.currentTurnIndex = (this.currentTurnIndex + 1) % this.nTanks;
		}

		// change power with page up/down
		const tank = this.tanks[this.turnOrder[this.currentTurnIndex]];
		const delta = this.game.loop.delta;
		if (this.pageUpKey.isDown || this.wKey.isDown) {
			tank.adjustPower(delta / 75);
		}
		if (this.pageDownKey.isDown || this.sKey.isDown) {
			tank.adjustPower(-delta / 75);
		}

		if(Phaser.Input.Keyboard.JustDown(this.aKey)) {
			tank.scrollWeaponSelection(-1);
		}
		if(Phaser.Input.Keyboard.JustDown(this.dKey)) {
			tank.scrollWeaponSelection(1);
		}

		// Update projectiles
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			const projectile = this.projectiles[i];
			projectile.update(this.terrain, this.tanks);
			if (!projectile.active) {
				const collisionInfo = (projectile as any).collisionInfo;
				const responsibleTank = projectile.parentTank;
				if (collisionInfo && collisionInfo.position) {
					// Trigger explosion at collision point
					this.explosionAt(collisionInfo.position.x, collisionInfo.position.y, projectile.explosionPower, projectile.explosionRadius, responsibleTank);
					
					// Apply damage to tank if direct hit
					// TODO: change damage calculation
					if (collisionInfo.type === 'tank' && collisionInfo.target) {
						collisionInfo.target.damage(20, this.showDamageNumber.bind(this));
						if (responsibleTank && responsibleTank !== collisionInfo.target) {
							responsibleTank.roundDamage[responsibleTank.roundDamage.length - 1] += 20;
						}
					}
				}
				this.projectiles.splice(i, 1);
				projectile.destroy();
			}
		}
		
		
		// Update tanks
		for (let i = 0; i < this.nTanks; i++) {
			const tank = this.tanks[i];
			const explosionInfo = tank.update(tank === this.tanks[this.turnOrder[this.currentTurnIndex]] ? this.cursors : undefined);
			if (explosionInfo.exploded && explosionInfo.x && explosionInfo.y) {
				//console.log(`Tank ${tank.name} exploded at (${explosionInfo.x}, ${explosionInfo.y})`);
				this.explosionAt(explosionInfo.x, explosionInfo.y, 3, 60);
				this.deathOrder[this.deathOrder.length] = i;
			}
		}
		
		// Update terrain rendering
		this.terrain.update();
		
		// Update dashboard with current tank
		const currentTank = this.tanks[this.turnOrder[this.currentTurnIndex]];
		this.dashboard.update(currentTank, this.terrain, this.tanks);
	}

	endRound(winner?: Tank) {
		this.launchedShop = true;
		// distribute money based on damage dealt and bonus to winner
		const totalWinnings = 20_000 + 10_000 * (this.roundNumber);
		const pityMoney = totalWinnings * 0.1;
		//console.log(`Round over. ${winner ? winner.name + ' wins!' : 'No winner.'} Distributing ${totalWinnings} cash plus ${pityMoney} pity money to each tank.`);
		if (winner) winner.cash += totalWinnings * 0.2;
		const totalDamage = this.tanks.reduce((sum, tank) => sum + tank.roundDamage[tank.roundDamage.length - 1], 0);
		for (const tank of this.tanks) {
			const damageShare = totalDamage > 0 ? tank.roundDamage[tank.roundDamage.length - 1] / totalDamage : 0;
			//console.log(`${tank.name} dealt ${tank.roundDamage[tank.roundDamage.length - 1]} damage, share: ${(damageShare*100).toFixed(2)}% or ${Math.floor(totalWinnings * 0.8 * damageShare*0.01)*100} cash`);
			tank.cash += Math.floor(totalWinnings * 0.8 * damageShare*0.01)*100 + pityMoney;
		}
		this.roundNumber += 1;

		// Launch shop scene after 1 second
		this.time.delayedCall(1000, () => {
			this.scene.launch('ShopScene', { callingScene: this, tanks: this.tanks });
		});
	}

	newRound() { // fix tank spacing and turn order
		if (this.deathOrder.length > this.nTanks - 2) {
			// clear turn order
			this.turnOrder = [];
			// died first go first
			for (let i = 0; i < this.deathOrder.length; i++) {
				this.turnOrder.push(this.deathOrder[i]);
			}
			console.log(`Death order: ${this.deathOrder} type of ${typeof this.deathOrder}`);
			console.log('Death turn order:', this.turnOrder);
			
			const remainingTank = (Phaser.Utils.Array.NumberArray(0, this.nTanks - 1) as number[]).filter(i => !this.deathOrder.includes(i));
			console.log('Remaining tank:', remainingTank);
			Phaser.Utils.Array.Shuffle(remainingTank);
			this.turnOrder.push(...remainingTank);
		}
		else Phaser.Utils.Array.Shuffle(this.turnOrder);
		console.log('New turn order:', this.turnOrder);

		this.deathOrder = [];

		this.currentTurnIndex = 0;
		if (this.terrainType === 'random') {
			let newTerrain = this.terrain.getCurrentType();
			while (newTerrain === this.terrain.getCurrentType())newTerrain = Phaser.Utils.Array.GetRandom(['desert', 'forest', 'mountains', 'city']);
			this.terrain.switchTerrain(newTerrain);
		} else {
			this.terrain.switchTerrain(this.terrainType as TerrainType);
		}
		this.distributeTanks();
		this.clearProjectiles();
	}

	clearProjectiles() {
		while (this.projectiles.length > 0) {
			const projectile = this.projectiles.pop();
			if (projectile) {
				projectile.destroy();
			}
		}
	}

	distributeTanks( randomness: number = 0.4) {
		// Distribute tanks evenly across the terrain
		const segmentWidth = 1200 / this.nTanks;
		const tankOrder = Phaser.Utils.Array.NumberArray(0, this.nTanks - 1) as number[];
		Phaser.Utils.Array.Shuffle(tankOrder);
		for (let i = 0; i < this.nTanks; i++) {
			const tank = this.tanks[tankOrder[i]];
			tank.reset();
			const x = i * segmentWidth + segmentWidth * Phaser.Math.FloatBetween(0.5-randomness, 0.5+randomness);
			tank.placeTank(tank, x);
		}
		this.terrain.updateTerrain();
	}

	explosionAt(x: number, y: number, power: number, radius: number, responsibleTank?: Tank) {
		// Create explosion image
		const explosion = this.add.image(x, y, 'explosion');
		explosion.setDepth(10);
		explosion.setAlpha(0);
		explosion.setScale(0);
		this.explosions.push(explosion);
		
		const maxScale = radius / 256; // Scale based on power
		const duration = 150 / (power**0.5) * (radius/20)**0.75; // Total animation duration in ms
		
		// Animate explosion with tween
		this.tweens.add({
			targets: explosion,
			alpha: { from: 0, to: 1 },
			scale: { from: 0, to: maxScale },
			duration: duration,
			ease: 'Cubic.easeOut',
			onComplete: () => {
				// Fade out
				this.tweens.add({
					targets: explosion,
					alpha: { from: 1, to: 0 },
					scale: { from: maxScale, to: maxScale * 0.75 },
					duration: duration,//duration*2*(1+((radius/50)**0.5)),
					ease: 'linear',
					onComplete: () => {
						explosion.destroy();
						const index = this.explosions.indexOf(explosion);
						if (index > -1) {
							this.explosions.splice(index, 1);
						}
					}
				});
			}
		});
		
		// Schedule environment damage halfway through explosion
		this.time.delayedCall(duration, () => {
			const damageRadius = radius;
			this.terrain.damageTerrain(x, y, damageRadius, Math.exp(-power), power);
			// TODO: damage tanks
			
			// Dirty tank physics in affected area
			for (const tank of this.tanks) {
				if (Math.abs(tank.x - x) < damageRadius + 50) {
					tank.dirtyPhysicsUpdate();
				}
			}

			// deactivate projectiles
			for (const projectile of this.projectiles) {
				const pos = projectile.getPosition();
				if (Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < damageRadius) {
					projectile.active = false;
				}
			}

			// damage tanks
			for (const tank of this.tanks) {
				const dist = Math.max(0, Phaser.Math.Distance.Between(x, y, tank.x, tank.y) - tank.tankWidth/2);
				if (dist < damageRadius) {
					const damageAmount = Math.ceil(Math.max(0, power * 20 * Math.exp(-dist / damageRadius)));
					tank.damage(damageAmount, this.showDamageNumber.bind(this));
					if (responsibleTank && responsibleTank !== tank) {
						responsibleTank.roundDamage[responsibleTank.roundDamage.length - 1] += damageAmount;
					}
				}
			}
		});
	}

	private showDamageNumber(x: number, y: number, damage: number) {
		if (damage < 1) return;
		
		const damageText = this.add.text(x, y, Math.round(damage).toString(), {
			fontSize: `${Math.floor(20*(damage/20)**0.5)}px`,
			color: '#00ff00',
			fontStyle: 'bold',
			fontFamily: 'Arial',
		});
		damageText.setOrigin(0.5, 0.5);
		damageText.setDepth(15);
		this.damageNumbers.push(damageText);
		
		// Animate the damage number floating up and fading out
		this.tweens.add({
			targets: damageText,
			y: y - 40,
			alpha: { from: 2, to: 0 },
			duration: 2000,
			ease: 'Cubic.easeOut',
			onComplete: () => {
				damageText.destroy();
				const index = this.damageNumbers.indexOf(damageText);
				if (index > -1) {
					this.damageNumbers.splice(index, 1);
				}
			}
		});
	}
}
