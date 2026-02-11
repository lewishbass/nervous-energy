import Phaser from 'phaser';
import { Terrain } from './Terrain';
import { Projectile } from './Projectile';
import { projectilelist } from './projectiles/projectilelist';
import { v4 as uuidv4 } from 'uuid';

const svgText = `
	<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="29.9" height="13.42" viewBox="0 0 17.08 7.69"><path d="m.7 5.98 1.06 1.7H15.3l1.06-1.77"/><path fill="#FF0000" d="M2.37 2.17 3.59 0H13.6l1.32 2.17L17.1 3.3l-.34 2.83H.3l-.33-2.83z"/></svg>
`;

export class Tank {
	private scene: Phaser.Scene;
	private body: Phaser.Physics.Matter.Sprite | undefined;
	private turret: Phaser.GameObjects.Graphics;
	private debugGraphics: Phaser.GameObjects.Graphics;

	public healthBar: Phaser.GameObjects.Graphics;
	 
	public id: string = "";
	public x: number;
	public y: number;
	private angle: number = 0; // Tank body angle
	public turretAngle: number = -90; // Turret angle in degrees
	private turretOrigin: { x: number, y: number } = { x: 0, y: -3 };
	public power: number = 50; // Projectile launch power (now public for dashboard)
	
	private speed: number = 25;
	private rotationSpeed: number = 2;
	public turretRotationSpeed: number = 48;
	private recoilOffset: number = 0; // Recoil animation offset
	private recoilTween?: Phaser.Tweens.Tween; // Track the recoil tween
	private gravity = 1000;
	private drag = 0.1;
	private fallSpeed = 0;

	private aimingLine: Phaser.GameObjects.Graphics;
	private aimingProjectile?: Projectile;

	private projectiles: Projectile[];

	public tankWidth: number = 24;
	public tankYOffset: number = 5;

	private dirtyPhysics: boolean = true; // physics is in steady state, stop updating unless moved
	private terrain: Terrain; // pointer to terrain for collision checks

	public color: number = 0xff00ff;

	public name: string = "";
	
	private showDebug: boolean;
	public drawAiming: boolean = true;

	public roundDamage: number[] = [];


	//inventory
	public selectedWeapon: string = 'small_missile';
	public arsenal:Record<string, number> = {
		'small_missile': 50,
		//'missile': 5,
	 	//'small_atom_bomb' : 5,
		//'atom_bomb' : 5,
		//'volcano_bomb' : 25,
		//'shower' : 5,
		//'hot_shower' : 5,
		//'small_ball' : 5,
		//'ball' : 5,
		//'large_ball' : 5,
		//'small_ball_v2' : 5,
		//'ball_v2' : 5,
		//'large_ball_v2' : 5,
		//'air_strike' : 5,
	};
	public gadgets:Record<string, number> = {
		'repair_kit': 2,
		'parachutes': 2,
		'teleport': 1
	};
	public shields:Record<string, number> = {
		'weak_shield': 1,
		'shield': 1,
		'strong_shield': 1,
		'super_shield': 1
	};

	public alive: boolean = true;

	// stats block
	public score: number = 0;
	public cash: number = 10_000;
	public maxHealth: number = 100;
	public health: number = this.maxHealth;
	public fuel: number = 100; // consumed when moving
	public maxFuel: number = 100;
	public climbSlope: number = 1.0; // max ration of height to width for climbing

	public fuelEfficiency: number = 1; // multiplier for fuel consumption
	public armor: number = 0;

	private lastDamageShown: number = 0; // timestamp of last damage text shown

	private muzzleSpeed: number = 800; // px/s

	private static createCustomTexture(scene: Phaser.Scene, key: string, hexColor: number, svgText: string): Promise<void> {
		// Convert hex color to CSS color string
		const colorString = '#' + hexColor.toString(16).padStart(6, '0');

		// Replace the accent color (assuming #FF0000 is the template color)
		const updatedSvg = svgText.replace(/#FF0000/gi, colorString);
		console.log(`Creating custom texture with color ${colorString}`);

		// Load into Phaser as base64
		const base64 = 'data:image/svg+xml;base64,' + btoa(updatedSvg);

		return new Promise((resolve) => {
			const loader = scene.load.image(key, base64);
			scene.load.once('complete', () => {
				console.log(`Texture ${key} loaded successfully`);
				resolve();
			});
			scene.load.start();
		});
	}

	constructor(scene: Phaser.Scene, x: number, y: number, showDebug: boolean = false, terrain: Terrain, name: string = "", projectiles: Projectile[], hexColor: number = 0xff00ff) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.showDebug = showDebug;
		this.terrain = terrain;
		this.name = name;
		this.id = uuidv4();
		this.projectiles = projectiles;
		this.color = hexColor;
		// Don't create Matter body yet - will be done in initializeBody()
		this.initializeBody().then(() => {
			// Body is ready, initial draw
			this.drawTurret();
		});
		
		// Create turret graphics
		this.turret = scene.add.graphics();
		this.turret.setDepth(5.6);
		this.healthBar = scene.add.graphics();
		this.healthBar.setDepth(5.7);
		
		// Create debug graphics
		this.debugGraphics = scene.add.graphics();
		this.debugGraphics.setDepth(5.7);

		// Create aiming line
		this.aimingLine = scene.add.graphics();
		this.aimingLine.setDepth(3.5);
		this.aimingProjectile = new Projectile(this.scene, this.x, this.y-10, 0, 0, this.terrain.getWindSpeed(), this.projectiles, this);
	}

	async initializeBody() {
		// Create unique texture key based on color
		const textureKey = `player_${this.color.toString(16)}_${this.name}`;

		// Only create texture if it doesn't exist
		if (!this.scene.textures.exists(textureKey)) {
			await Tank.createCustomTexture(this.scene, textureKey, this.color, svgText);
		}

		// Create Matter sprite with custom colored texture
		this.body = this.scene.matter.add.sprite(this.x, this.y, textureKey, undefined, {
			isStatic: true, // We'll handle movement manually
		});
		this.body.setDepth(5.5);
		this.body.setFixedRotation();
		this.body.setScale(1, 1.15);
	}

	public getTextureKey() {
		return `player_${this.color.toString(16)}_${this.name}`;
	}


	update(cursors?: Phaser.Types.Input.Keyboard.CursorKeys) : {exploded: boolean, x?: number, y?: number} {

		if (this.alive === false) return { exploded: false };

		if (this.health <= 0 && this.alive === true) {
			const explodepos = { x: this.x, y: this.y };
			this.explode();
			return { exploded: true, x: explodepos.x, y: explodepos.y };
		}



		const delta = this.scene.game.loop.delta;
		// Custom movement logic
		if (cursors) {
			if (cursors.up.isDown) {
				this.rotateTurret(delta / 1000 * this.turretRotationSpeed);
			}
			if (cursors.down.isDown) {
				this.rotateTurret(-delta / 1000 * this.turretRotationSpeed);
			}

			if (cursors.left.isDown) {
				this.move(delta, -1)
			}
			if (cursors.right.isDown) {
				this.move(delta, 1)
			}
			this.drawTurret();
		}

		// Only update physics if dirty
		if (this.dirtyPhysics) {
			this.doPhysicsUpdate();
		}

		
		// Draw debug hitbox
		if (this.showDebug) {
			this.drawDebugHitbox();
		}
		return { exploded: false };
	}

	private doPhysicsUpdate() {

		const terrainY = this.getTerrainCollision(this.x);
		if (Math.abs(this.y - terrainY + this.tankYOffset) < 1) {// On ground
			this.dirtyPhysics = false;
			this.fallSpeed = 0;
		}
		else if (this.y < terrainY - this.tankYOffset) {// In air
			// Simple gravity effect
			this.fallSpeed += this.gravity * (this.scene.game.loop.delta / 1000); 
			this.fallSpeed *= this.drag**(this.scene.game.loop.delta / 1000); 
			this.y += this.fallSpeed * (this.scene.game.loop.delta / 1000); 
		}
		else if(this.y > terrainY - this.tankYOffset) {// Below ground
			this.y = terrainY - this.tankYOffset;
		} else {
			this.dirtyPhysics = false;
		}
		if (this.y > 900-2-this.tankYOffset) { // in the void
			this.health = 0;
			this.dirtyPhysics = false;
		}
		this.updateTankPos();
	}

	updateTankPos() {
		// Update Matter body position manually
		//console.log(`Updating tank position to x=${this.x}, y=${this.y}`);
		if (this.body && this.body.body) {
			this.body.setPosition(this.x, this.y);
			this.body.setRotation(Phaser.Math.DegToRad(this.angle));
		} else {
			console.warn("Tank body or body.body is undefined");
		}
		this.drawTurret();
	}



	move(delta: number, direction: number) {3

		this.dirtyPhysics = true;
		if (this.y + this.tankYOffset < this.getTerrainCollision(this.x) -50) {
			// In air, no movement, only gravity
			return;
		}

		const newX = this.x + direction * this.speed * (delta / 1000); // Normalize to 60 FPS
		const slope = Math.max(0, ((this.y + this.tankYOffset) - this.getTerrainCollision(newX)) / Math.abs(newX - this.x));
		
		if (slope > this.climbSlope) return; // Too steep to climb
		if(this.fuel <= 0) return; // No fuel
		
		const slopeSlowdown = 1 - 1.3**(-(this.climbSlope - slope) / this.climbSlope * 5);
		this.x += direction * this.speed * slopeSlowdown * (delta / 1000);
		this.fuel = Math.max(0, this.fuel - delta / 40 * (0.9 ** this.fuelEfficiency)); // consume fuel
		this.clickSound(0.2, slope * 400 - 1800);
		if(slope>0)this.y = this.getTerrainCollision(this.x) - this.tankYOffset; // Adjust y based on terrain height
		this.updateTankPos()
	}

	private getTerrainCollision(x: number) {
		const terrainGap = this.terrain.points[1].x - this.terrain.points[0].x;
		const points = this.terrain.points.map(pt => {
			// Simple bounding box check
			if (pt.x >= x - this.tankWidth / 2 - terrainGap && pt.x <= x + this.tankWidth / 2 + terrainGap) {
				return pt
			}
		});
		const filteredPoints = points.filter(pt => pt !== undefined) as Phaser.Math.Vector2[];
		if(filteredPoints === undefined || filteredPoints.length < 1) return this.y;
		if(filteredPoints.length < 2) return filteredPoints[0]!.y;
		//interpolate edge points
		const leftStart = filteredPoints[0];
		const leftEnd = filteredPoints[1];
		const rightStart = filteredPoints[filteredPoints.length - 2];
		const rightEnd = filteredPoints[filteredPoints.length - 1];
		//remove start and end from filtered points
		filteredPoints.splice(0, 1);
		filteredPoints.splice(filteredPoints.length - 1, 1);
		const leftIntercept = ((x-this.tankWidth/2) - leftStart.x)/(leftEnd.x - leftStart.x) * (leftEnd.y - leftStart.y) + leftStart.y;
		const rightIntercept = ((x+this.tankWidth/2) - rightStart.x)/(rightEnd.x - rightStart.x) * (rightEnd.y - rightStart.y) + rightStart.y;
		filteredPoints.unshift(new Phaser.Math.Vector2(x - this.tankWidth / 2, leftIntercept));
		filteredPoints.push(new Phaser.Math.Vector2(x + this.tankWidth / 2, rightIntercept));


		const minY = Math.min(...filteredPoints.map(pt => pt!.y));
		return minY;
	}


	
	rotateTurret(delta: number) {
		const lastAngle = this.turretAngle;
		this.turretAngle += delta;
		// Clamp turret angle to reasonable range
		this.turretAngle = Phaser.Math.Clamp(this.turretAngle, -180, 0);
		if (lastAngle !== this.turretAngle) {
			// Draw turret
			this.drawTurret();

			const fraction = Math.abs(this.turretAngle + 90) / 90;
			const vol = (Math.abs(lastAngle - this.turretAngle) / 90) ** 0.5;
			this.clickSound(vol, fraction * -1200 + 600);
		}
	}
	
	adjustPower(delta: number) {
		const lastPower = this.power;
		this.power += delta;
		this.power = Phaser.Math.Clamp(this.power, 0, Math.min(100, this.health));

		if (lastPower !== this.power) {
			const fraction = (this.power) / 100;
			const vol = (Math.abs(lastPower - this.power) / 100) ** 0.5;
			this.clickSound(vol, fraction * -1200 + 600);
		}
	}
	

	private drawTurret() {
		this.turret.clear();
		this.healthBar.clear();
		this.aimingLine.clear();
		if (this.alive === false) return;
		
		// Draw health bar
		const healthBarWidth = 24;
		const healthBarY = this.y + 15;
		const healthBarX = this.x - healthBarWidth / 2;
		
		// Background (max health) - dark red, 1px
		this.healthBar.lineStyle(1, 0x440000);
		this.healthBar.lineBetween(healthBarX, healthBarY, healthBarX + healthBarWidth, healthBarY);
		
		// Current health - red, 2px
		const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
		this.healthBar.lineStyle(2, 0xff0000);
		this.healthBar.lineBetween(healthBarX, healthBarY, healthBarX + currentHealthWidth, healthBarY);
		
		// Draw turret barrel
		this.turret.lineStyle(3, 0x333333);
		
		const turretLength = 16;
		const absoluteAngle = Phaser.Math.DegToRad(this.angle + this.turretAngle);
		const baseX = this.x + this.turretOrigin.x;
		const baseY = this.y + this.turretOrigin.y;
		
		// Apply recoil offset (push barrel back)
		const recoilX = baseX - Math.cos(absoluteAngle) * this.recoilOffset;
		const recoilY = baseY - Math.sin(absoluteAngle) * this.recoilOffset;
		
		const endX = recoilX + Math.cos(absoluteAngle) * turretLength;
		const endY = recoilY + Math.sin(absoluteAngle) * turretLength;
		
		this.turret.lineBetween(recoilX, recoilY, endX, endY);
		this.turret.strokePath();

		this.turret.lineStyle(4, 0x003300);
		this.turret.lineBetween(endX, endY, endX + Math.cos(absoluteAngle) * 6, endY + Math.sin(absoluteAngle) * 6);


		// firing params
		const absoluteAngle2 = this.angle + this.turretAngle;
		const muzzleDistance = 25;

		const startX = this.x + this.turretOrigin.x + Math.cos(Phaser.Math.DegToRad(absoluteAngle2)) * muzzleDistance;
		const startY = this.y + this.turretOrigin.y + Math.sin(Phaser.Math.DegToRad(absoluteAngle2)) * muzzleDistance;
		const vx = Math.cos(Phaser.Math.DegToRad(absoluteAngle2)) * (this.power / 100) ** 1.3 * this.muzzleSpeed;
		const vy = Math.sin(Phaser.Math.DegToRad(absoluteAngle2)) * (this.power / 100) ** 1.3 * this.muzzleSpeed;

		// draw aiming line - use 0 as start time so getPosition(t) uses t as absolute time
		if (this.drawAiming) {
			this.aimingProjectile?.changeParams(
				startX,
				startY,
				vx,
				vy,
				this.terrain.getWindSpeed(),
				0  // Use 0 as start time
			);

			const maxTime = 2;
			let startPos = this.aimingProjectile!.getPosition(0);
			for (let t = 0; t < maxTime; t += 0.1) {
				const pos = this.aimingProjectile?.getPosition(t);
				if (pos) {
					// Calculate alpha that fades from 0.02 to 0 over time
					const alpha = (1 - t / maxTime);
					this.aimingLine.lineStyle(5 * (1 - alpha), 0xff00ff, alpha * 0.1);
					this.aimingLine.lineBetween(startPos.x, startPos.y, pos.x, pos.y);
					startPos = pos;
				}
			}
			this.aimingLine.strokePath();
		}

	}
	
	private drawDebugHitbox() {
		this.debugGraphics.clear();
		if (!this.body || !this.body.body) return;
		this.debugGraphics.lineStyle(2, 0xff0000, 0.8);
		
		const matterBody = this.body.body as MatterJS.BodyType;
		const vertices = (matterBody as any).vertices;
		
		if (vertices && vertices.length > 0) {
			this.debugGraphics.beginPath();
			this.debugGraphics.moveTo(vertices[0].x, vertices[0].y);
			for (let i = 1; i < vertices.length; i++) {
				this.debugGraphics.lineTo(vertices[i].x, vertices[i].y);
			}
			this.debugGraphics.closePath();
			this.debugGraphics.strokePath();
		}

		// 
	}
	
	fire(windSpeed: number): void {

		this.scene.sound.play('fire', { volume: Phaser.Math.FloatBetween(0.1, 0.3), detune: Phaser.Math.Between(-50, 50) });

		if(!this.arsenal[this.selectedWeapon]) return;
		if (this.arsenal[this.selectedWeapon] <= 0) return;

		this.arsenal[this.selectedWeapon] -= 1;
		const prevWeapon = this.selectedWeapon;
		if (!(prevWeapon in projectilelist)) return;

		if (this.arsenal[this.selectedWeapon] <= 0) {// auto-switch weapon if out of ammo
			this.scrollWeaponSelection(1);
			delete this.arsenal[prevWeapon];
		}

		const absoluteAngle = this.angle + this.turretAngle;
		const muzzleDistance = 25;
		
		const startX = this.x + this.turretOrigin.x + Math.cos(Phaser.Math.DegToRad(absoluteAngle)) * muzzleDistance;
		const startY = this.y + this.turretOrigin.y + Math.sin(Phaser.Math.DegToRad(absoluteAngle)) * muzzleDistance;
		
		const vx = Math.cos(Phaser.Math.DegToRad(absoluteAngle)) * (this.power/100)**1.3*this.muzzleSpeed;
		const vy = Math.sin(Phaser.Math.DegToRad(absoluteAngle)) * (this.power/100)**1.3*this.muzzleSpeed;
		
		// Kill existing recoil tween if it exists
		if (this.recoilTween) {
			this.recoilTween.stop();
			this.recoilOffset = 0;
		}
		
		// Animate recoil
		this.recoilTween = this.scene.tweens.add({
			targets: this,
			recoilOffset: 6, // Kick back distance
			duration: 160,
			ease: 'Power2',
			yoyo: true,
			onUpdate: () => {
				this.drawTurret();
			},
			onComplete: () => {
				this.recoilTween = undefined;
			}
		});
		

		this.projectiles.push(new projectilelist[prevWeapon](this.scene, startX, startY, vx, vy, windSpeed, this.projectiles, this) as Projectile);
	}
	
	getPosition(): { x: number, y: number } {
		return { x: this.x, y: this.y };
	}
	
	getTurretAngle(): number {
		return this.turretAngle;
	}
	
	getPower(): number {
		return this.power;
	}
	
	dirtyPhysicsUpdate() {
		this.dirtyPhysics = true;
	}
	
	destroy() {
		if (this.body) {
			this.body.destroy();
		}
		this.turret.destroy();
		this.debugGraphics.destroy();
		this.aimingLine.destroy();
	}
	placeTank(tank: Tank, x: number = -1) {
		if (x === -1) {
			x = Phaser.Math.FloatBetween(100, 1100);
		}
		// finds min y in terrain around x
		// places tank there
		// flatten terrain under tank
		const closePoints = this.terrain.points.filter(pt => Math.abs(pt.x - x) < this.tankWidth / 2 + 5);
		if (closePoints.length === 0) {
			tank.y = 600 - this.tankYOffset;
			tank.x = x;
			this.updateTankPos();
			return;
		}
		const maxY = Math.max(...closePoints.map(pt => pt.y));
		const minY = Math.min(...closePoints.map(pt => pt.y));
		if (maxY - minY > 10) {
			const placeY = minY*0.25 + maxY*0.75;
			tank.y = placeY - this.tankYOffset; 
			closePoints.forEach(pt => {
				pt.y = placeY;
			});
		} else {
			tank.y = minY - this.tankYOffset;
		}
		tank.x = x;
		//console.log(`Placing tank ${tank.name} at x=${tank.x}, y=${tank.y}`);
		this.updateTankPos();

	}

	explode() {
		
		this.scene.sound.play('boom', { volume: 0.7, detune: Phaser.Math.Between(-100, 100) });

		this.health = 0;
		this.x = -200;
		this.y = -200;
		this.alive = false;
		this.updateTankPos();
	}

	damage(amount: number, showDamageCallback?: (x: number, y: number, damage: number) => void) {
		const effectiveDamage = Math.max(0, amount - this.armor);
		this.health = Math.max(0, this.health - effectiveDamage);
		//console.log(`${this.name} took ${amount} - > ${effectiveDamage} damage, health now ${this.health}`);
		const posX = this.x;
		const posY = this.y;

		// Show damage number with debouncing (500ms cooldown)
		const now = Date.now();
		if (showDamageCallback) {
			const textDelay = this.lastDamageShown + 250 > now ? this.lastDamageShown + 250 - now : 0;
			this.scene.time.delayedCall(textDelay, () => {
				showDamageCallback(posX, posY - 20, effectiveDamage);
			});
			this.lastDamageShown = now;
		}
	}

	reset() {
		this.health = this.maxHealth;
		this.power = 50;
		this.fuel = this.maxFuel;
		this.alive = true;
		this.roundDamage.push(0);
	}

	scrollWeaponSelection(delta: number) {
		if (Object.keys(this.arsenal).length === 0) {
			this.selectedWeapon = "";
			return;
		}
		const weapons = Object.keys(this.arsenal);
		delta = Phaser.Math.Clamp(delta, -weapons.length, weapons.length);
		let currentIndex = weapons.indexOf(this.selectedWeapon) || 0;
		currentIndex = (currentIndex + delta + weapons.length) % weapons.length;
		this.selectedWeapon = weapons[currentIndex];
	}

	getArsenal(itemName: string): number {
		return this.arsenal[itemName] || 0;
	}

	addArsenal(itemName: string, amount: number) {
		if (this.arsenal[itemName]) {
			this.arsenal[itemName] += amount;
		} else {
			this.arsenal[itemName] = amount;
		}
	}

	getGadget(gadgetName: string): number {
		return this.gadgets[gadgetName] || 0;
	}
	addGadget(gadgetName: string, amount: number) {
		if (this.gadgets[gadgetName]) {
			this.gadgets[gadgetName] += amount;
		} else {
			this.gadgets[gadgetName] = amount;
		}
	}

	getShield(shieldName: string): number {
		return this.shields[shieldName] || 0;
	}
	addShield(shieldName: string, amount: number) {
		if (this.shields[shieldName]) {
			this.shields[shieldName] += amount;
		} else {
			this.shields[shieldName] = amount;
		}
	}

	clickSound(volume: number = 1, detune: number = 0) {
		this.scene.sound.play('click', { volume: volume * Phaser.Math.FloatBetween(0.4, 0.8), detune: detune + Phaser.Math.Between(-200, 200) });
	}

}

