import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';

class SmallAtomBomb extends Projectile {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 50;
		this.explosionPower = 3.5;
		this.radius = 2;
		this.color = 0xff0000;
		this.soundKey = 'kaboom';
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 } ) {
		//console.log('Missile hit at ', collision.position);
		super.hit(collision);
	}
}

class AtomBomb extends Projectile {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		// Set explosion properties
		this.explosionRadius = 80;
		this.explosionPower = 4;
		this.radius = 2;
		this.color = 0xff0000;
	}

	hit(collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 }) {
		//console.log('Missile hit at ', collision.position);
		super.hit(collision);
	}
}

export { AtomBomb , SmallAtomBomb };