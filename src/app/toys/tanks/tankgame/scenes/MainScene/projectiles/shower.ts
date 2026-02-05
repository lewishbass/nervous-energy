import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Terrain } from '../Terrain';
import { Tank } from '../Tank';

class Shower extends Projectile {
	private payloadReleased: boolean = false;
	public showerCount = 6;

	public payloadType: typeof Projectile = ShowerPayload;

	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 25;
		this.explosionPower = 2;
		this.radius = 3;
		this.color = 0x000000;
		this.soundKey = 'bang';
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 } ) {
		//console.log('Missile hit at ', collision.position);
		super.hit(collision);
	}
	draw() {
		// Draw projectile
		const pos = this.getPosition();
		this.graphics.clear();
		this.graphics.fillStyle(0x000000, 1);
		this.graphics.fillCircle(pos.x, pos.y, this.radius);
		super.draw()
	}
	update( terrain: Terrain, tanks: Tank[] ) : void {
		super.update(terrain, tanks);
		if (!this.payloadReleased && this.getVelocity().y >= 0) {
			this.payloadReleased = true;
			const pos = this.getPosition();
			const vel = this.getVelocity();
			for (let i = -this.showerCount / 2; i < this.showerCount / 2; i++) {
				const vx = vel.x + i * 25;
				const vy = vel.y;
				const showerProjectile = new this.payloadType(this.scene, pos.x, pos.y, vx, vy, terrain.getWindSpeed(), this.projectiles, this.parentTank);
				this.projectiles.push(showerProjectile);
			}
		}
	}
}

class ShowerPayload extends Projectile {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		this.explosionPower = 1.5;
		this.explosionRadius = 20;
		this.radius = 2;
		this.drag = 0.25;
		this.color = 0x111122;
		this.soundKey = 'crack';
	}
}

export { Shower, ShowerPayload };