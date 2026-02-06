import Phaser from 'phaser';
import { Terrain } from './Terrain';
import { Tank } from './Tank';

export class Projectile {
	public scene: Phaser.Scene;
	public graphics: Phaser.GameObjects.Graphics;
	
	private p0: Phaser.Math.Vector2; // Initial position
	private v0: Phaser.Math.Vector2; // Initial velocity
	public startTime: number;
	public windSpeed: number;
	public drag: number = 0.6; // Drag coefficient
	private gravity: number = 200;
	public radius: number = 5;
	public color: number = 0x000000;

	public soundKey = 'bang';

	public intangibleTime: number = 0; // seconds

	private windSpeedMultiplier: number = 3;
	
	public active: boolean = true;

	public explosionPower: number = 1; // damage multiplier
	public explosionRadius: number = 20; // px

	public drawVelocityVector: boolean = false;
	public velocityGraphics: Phaser.GameObjects.Graphics;

	protected projectiles: Projectile[];
	public parentTank: Tank;
	
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		this.scene = scene;
		this.p0 = new Phaser.Math.Vector2(x, y);
		this.v0 = new Phaser.Math.Vector2(vx, vy);
		this.windSpeed = windSpeed*this.windSpeedMultiplier;
		this.startTime = scene.time.now;
		this.projectiles = projectiles;
		this.parentTank = parentTank;
		this.graphics = scene.add.graphics();
		this.graphics.setDepth(6);

		this.velocityGraphics = scene.add.graphics();
		this.velocityGraphics.setDepth(20);
	}
	
	getPosition(time?: number): Phaser.Math.Vector2 {
		if (time === undefined) {
			time = (this.scene.time.now - this.startTime) / 1000;
		}
		if (time < 0) time = 0;
		
		// Terminal velocity components
		const v_terminal_x = this.windSpeed;
		const v_terminal_y = this.gravity / this.drag;
		
		// x(t) = x_0 + w_x * t + (v_x0 - w_x) * (1 - e ^ (-d * t)) / d
		// y(t) = y_0 + (w_y - g / d) * t + (v_y0 - w_y + g / d) * (1 - e ^ (-d * t)) / d
		const expTerm = Math.exp(-this.drag * time);
		
		const x = this.p0.x + v_terminal_x * time + (this.v0.x - v_terminal_x) * (1 - expTerm) / this.drag;
		const y = this.p0.y + v_terminal_y * time + (this.v0.y - v_terminal_y) * (1 - expTerm) / this.drag;
		
		return new Phaser.Math.Vector2(x, y);
	}

	getVelocity(time?: number): Phaser.Math.Vector2 {
		if (time === undefined) {
			time = (this.scene.time.now - this.startTime) / 1000;
		}
		if (time < 0) time = 0;

		// Terminal velocity components
		const v_terminal_x = this.windSpeed;
		const v_terminal_y = this.gravity / this.drag;

		const expTerm = Math.exp(-this.drag * time);

		const x = v_terminal_x + (this.v0.x - v_terminal_x) * expTerm;
		const y = v_terminal_y + (this.v0.y - v_terminal_y) * expTerm;

		return new Phaser.Math.Vector2(x, y);

	}
	
	getCollision(terrain: Terrain, tanks: Tank[]): { type: 'terrain' | 'tank' | 'bounds' | null, target?: Tank, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } {
		const currentTime = (this.scene.time.now - this.startTime) / 1000;
		if (currentTime < this.intangibleTime) return { type: null };
		const pos = this.getPosition(currentTime);
		
		const terrainCollision = this.collideTerrain(terrain, pos);
		if (terrainCollision.type) return terrainCollision;

		const tankCollision = this.collideTanks(terrain, tanks, pos);
		if (tankCollision.type) return tankCollision;

		const boundsCollision = this.collideBounds(pos);
		if (boundsCollision.type) return boundsCollision;
		return { type: null };
	}

	collideTanks(terrain: Terrain, tanks: Tank[], pos: Phaser.Math.Vector2): { type: 'terrain' | 'tank' | 'bounds' | null, target?: Tank, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } {
		// Check tank collisions
		for (const tank of tanks) {
			const tankPos = tank.getPosition();
			const distance = Math.sqrt((pos.x - tankPos.x) ** 2 + (pos.y - tankPos.y) ** 2);

			if (distance < this.radius + 12) { // 12 is approximate tank radius
				const normalVector = new Phaser.Math.Vector2(pos.x - tankPos.x, pos.y - tankPos.y).normalize();
				return { type: 'tank', target: tank, position: pos, normal: normalVector };
			}
		}
		return { type: null };
	}

	collideTerrain(terrain: Terrain, pos: Phaser.Math.Vector2): { type: 'terrain' | 'tank' | 'bounds' | null, target?: Tank, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } {
		// Check terrain collision
		const terrainPoints = terrain.points.filter(pt =>
			Math.abs(pt.x - pos.x) < this.radius + terrain.genGap + 5
		);

		for (let i = 0; i < terrainPoints.length - 1; i++) {
			const p1 = terrainPoints[i];
			const p2 = terrainPoints[i + 1];
			if (pos.x < p1.x || pos.x > p2.x) continue;
			// Linear interpolation to find terrain y at projectile x
			const terrainY = p1.y + (p2.y - p1.y) * (pos.x - p1.x) / (p2.x - p1.x);
			if (pos.y >= terrainY - this.radius) {
				const normalVector = new Phaser.Math.Vector2(p2.y - p1.y, -(p2.x - p1.x)).normalize();
				return { type: 'terrain', position: new Phaser.Math.Vector2(pos.x, terrainY), normal: normalVector };
			}
		}

		// backup terrain point check
		for (const pt of terrainPoints) {
			if (pos.distance(pt) < this.radius) {
				const normalVector = new Phaser.Math.Vector2(pos.x - pt.x, pos.y - pt.y).normalize();
				return { type: 'terrain', position: pos, normal: normalVector };
			}
		}
		return { type: null };
		
	}

	collideBounds(pos: Phaser.Math.Vector2): { type: 'terrain' | 'tank' | 'bounds' | null, target?: Tank, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } {
		// Check bounds
		if (pos.x < 0 || pos.x > 1200 || pos.y > 900) {
			let normalVector = new Phaser.Math.Vector2(0, 0);
			if (pos.x < 0) normalVector.x = 1;
			else if (pos.x > 1200) normalVector.x = -1;
			else if (pos.y > 900) normalVector.y = -1;
			return { type: 'bounds', position: pos, normal: normalVector };
		}
		return { type: null };
	}

	update(terrain: Terrain, tanks: Tank[]) : void {
		if (!this.active) return;
		
		const collision = this.getCollision(terrain, tanks);
		
		if (collision.type && collision.position) {
			this.hit(collision);
			// Store collision info for MainScene to handle
			(this as any).collisionInfo = collision;
		} else {
			this.draw();
		}
	}

	draw() {
		const pos = this.getPosition();
		this.graphics.clear();
		this.graphics.fillStyle(this.color, 1);
		this.graphics.fillCircle(pos.x, pos.y, this.radius);
		
		
	}

	drawVV() {
		// Draw velocity vector
		this.velocityGraphics.clear();
		if (this.drawVelocityVector) {
			const vectorScale = 0.2;
			const vel = this.getVelocity();
			const pos = this.getPosition();
			this.velocityGraphics.lineStyle(2, 0x00ff00, 1);
			this.velocityGraphics.beginPath();
			this.velocityGraphics.moveTo(pos.x, pos.y);
			this.velocityGraphics.lineTo(pos.x + vel.x * vectorScale, pos.y + vel.y * vectorScale);
			this.velocityGraphics.strokePath();
		}
	}

	changeParams(x: number, y: number, vx: number, vy: number, windSpeed: number, startTime?: number) {
		this.p0.set(x, y);
		this.v0.set(vx, vy);
		this.windSpeed = windSpeed*this.windSpeedMultiplier;
		this.startTime = startTime !== undefined ? startTime : this.scene.time.now;
		this.active = true;
	}

	changeStartTime(newStartTime: number) {
		this.startTime = newStartTime;
	}
	
	destroy() {
		this.graphics.destroy();
		this.velocityGraphics.destroy();
	}

	hitsound() {
		this.scene.sound.play(this.soundKey, { volume: 1-Math.exp(-this.explosionPower+Phaser.Math.FloatBetween(-1, 1)), detune: Phaser.Math.Between(-10, 200) - 10*(this.explosionRadius-20) });
	}

	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: Tank, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } ) {
		this.active = false;
		this.hitsound();
	}
}
