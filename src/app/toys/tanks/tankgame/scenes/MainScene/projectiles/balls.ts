import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';
import { Terrain } from '../Terrain';

class SmallBall extends Projectile {

	public onGround: boolean = false;
	public rollGravity: number = 1;
	public rollDirection: number | null = null;
	public rollSpeed: number = 65;
	public inertia: number = 5; // px below/above min before explode

	private minY: number | null = null;
	private lastY: number = 0;
	private lastNormal: Phaser.Math.Vector2 | null = null;

	public landPos: Phaser.Math.Vector2 | null = null;

	private leftLandPoint: Phaser.Math.Vector2 | null = null;
	private rightLandPoint: Phaser.Math.Vector2 | null = null;

	public terrain: Terrain | null = null;

	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 13;
		this.explosionPower = 1;
		this.radius = 1.5;
		this.color = 0x000000;
		this.soundKey = 'boom';
	}

	// ball determines roll direction by general slope of terrain on hit
	// keeps track of its min as it rolls at constant x speed
	// interpolates y of ground for y pos
	// if ypos is > min + margin explodes

	getVelocity(time?: number): Phaser.Math.Vector2 {
		if (time === undefined) {
			time = (this.scene.time.now - this.startTime) / 1000;
		}
		if (time < 0) time = 0;

		if (this.onGround) {
			if (this.landPos == null) console.log('SmallBall onGround but missing landPos');
			else if (this.terrain == null) console.log('SmallBall onGround but missing terrain');
			else {
				const x = this.landPos.x + this.rollSpeed * this.rollDirection! * time;
				const terrain = this.terrain;
				const closePoints = terrain.points.filter(p => Math.abs(p.x - x) < terrain.genGap + 5);
				const leftPoint = closePoints.reduce((prev, curr) => (curr.x <= x && curr.x > (prev?.x || -Infinity)) ? curr : prev, null as Phaser.Math.Vector2 | null);
				const rightPoint = closePoints.reduce((prev, curr) => (curr.x >= x && curr.x < (prev?.x || Infinity)) ? curr : prev, null as Phaser.Math.Vector2 | null);
				const vector = new Phaser.Math.Vector2(rightPoint!.x - leftPoint!.x, rightPoint!.y - leftPoint!.y);
				this.lastNormal = new Phaser.Math.Vector2(-vector.y, vector.x).normalize();
				if(!leftPoint || !rightPoint) return new Phaser.Math.Vector2(0, 0);
				//vector.normalize().scale(this.rollDirection! * this.rollSpeed);
				return new Phaser.Math.Vector2(this.rollSpeed*this.rollDirection!, vector.y / vector.x * this.rollSpeed *this.rollDirection!);
			}
			return new Phaser.Math.Vector2(0, 0);
		} else {
			return super.getVelocity(time);
		}
	}

	getPosition(time?: number): Phaser.Math.Vector2 {
		if (time === undefined) {
			time = (this.scene.time.now - this.startTime) / 1000;
		}
		if (time < 0) time = 0;

		if (this.onGround) {
			if (this.landPos == null) console.log('SmallBall onGround but missing landPos');
			else if (this.terrain == null) console.log('SmallBall onGround but missing terrain'); 
			else{
				const x = this.landPos.x + this.rollSpeed * this.rollDirection! * time;
				const terrain = this.terrain;
				const closePoints = terrain.points.filter(p => Math.abs(p.x - x) < terrain.genGap + 5);
				const leftPoint = closePoints.reduce((prev, curr) => (curr.x <= x && curr.x > (prev?.x || -Infinity)) ? curr : prev, null as Phaser.Math.Vector2 | null);
				const rightPoint = closePoints.reduce((prev, curr) => (curr.x >= x && curr.x < (prev?.x || Infinity)) ? curr : prev, null as Phaser.Math.Vector2 | null);
				if(!leftPoint || !rightPoint) return new Phaser.Math.Vector2(x, this.lastY);
				const y = Phaser.Math.Linear(leftPoint!.y, rightPoint!.y, (x - leftPoint!.x) / (rightPoint!.x - leftPoint!.x));
				this.lastY = y;
				this.minY = (this.minY === null) ? y * this.rollGravity * -1 : Math.min(this.minY, y * this.rollGravity * -1);
				return new Phaser.Math.Vector2(x, y);
			} 
			return new Phaser.Math.Vector2(0, 0);
		} 
			return super.getPosition(time);
		
	}

	
	collideTerrain(terrain: Terrain, pos: Phaser.Math.Vector2): { type: 'terrain' | 'tank' | 'bounds' | null; target?: Tank; position?: Phaser.Math.Vector2; normal?: Phaser.Math.Vector2; } {
		//store terrain for future use, bad way to do this, but easier than changing constructor for all projectiles
		this.terrain = terrain;
		if (this.onGround) {
			if (this.minY !== null) {
				//console.log(`Miny: ${this.minY}, Current y: ${pos.y * this.rollGravity * -1}, Inertia: ${this.inertia}`);
				if (pos.y * this.rollGravity * -1  > this.minY + this.inertia) {
					const normal = this.lastNormal || new Phaser.Math.Vector2(0, -1);
					return { type: 'terrain', position: pos, normal: normal };
				}
			} 
			return { type: null };
		} else {
			return super.collideTerrain(terrain, pos);
		}
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 } ) {
		
		if (this.onGround) {
			super.hit(collision);
			return;
		}
		if (collision.type === 'tank' || collision.type === 'bounds') {
			super.hit(collision);
			return;	
		}

		this.landPos = collision.position ? collision.position.clone() : null;
		this.onGround = true;
		this.startTime = this.scene.time.now;
		this.minY = this.landPos!.y * this.rollGravity * -1;
		// calculate slope for roll direction
		if (this.terrain == null) console.log('SmallBall onGround but missing terrain');
		else {
			const x = this.landPos!.x;
			const terrain = this.terrain;
			const closePoints = terrain.points.filter(p => Math.abs(p.x - x) < terrain.genGap * 2);
			//console.log(` Close points for slope calc: ${this.landPos!.x.toFixed(1)},${this.landPos!.y.toFixed(1)}`);
			// average slope of nearby points
			let totalSlope = 0;
			closePoints.forEach((pt, index) => {
				totalSlope += (pt.y-this.landPos!.y)/(pt.x - this.landPos!.x);
				//console.log(`  Point ${index}: (${(pt.x - this.landPos!.x).toFixed(1)},${(pt.y - this.landPos!.y).toFixed(1)}) slope ${((pt.y-this.landPos!.y)/(pt.x - this.landPos!.x)).toFixed(3)}`);
			});
			if (totalSlope * this.rollGravity > 0) this.rollDirection = 1;
			else this.rollDirection = -1;
			//console.log(`SmallBall roll direction set to ${this.rollDirection} with total slope ${totalSlope}`);
		}
		

	}
}

class Ball extends SmallBall{
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		// Set explosion properties
		this.explosionRadius = 20;
		this.explosionPower = 1.5;
		this.radius = 2;
		this.color = 0x000000;
		this.soundKey = 'bang';
	}
}

class LargeBall extends SmallBall {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		this.inertia = 10;
		// Set explosion properties
		this.explosionRadius = 30;
		this.explosionPower = 2;
		this.radius = 2.5;
		this.color = 0xff3300;
		this.soundKey = 'boom';
	}
}

class SmallBallV2 extends SmallBall {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		this.inertia = 15;
		this.rollGravity = -1;
		this.soundKey = 'bang';
	}
}

class BallV2 extends SmallBall {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		this.inertia = 10;
		this.rollGravity = -1;

		// Set explosion properties
		this.explosionRadius = 20;
		this.explosionPower = 1.5;
		this.radius = 2;
		this.color = 0x000000;
		this.soundKey = 'boom';
	}
}

class LargeBallV2 extends SmallBall {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		this.inertia = 15;
		this.rollGravity = -1;

		// Set explosion properties
		this.explosionRadius = 30;
		this.explosionPower = 2;
		this.radius = 2.5;
		this.color = 0xff3300;
		this.soundKey = 'boom';
	}
}

export { SmallBall, Ball, LargeBall, SmallBallV2, BallV2, LargeBallV2 };