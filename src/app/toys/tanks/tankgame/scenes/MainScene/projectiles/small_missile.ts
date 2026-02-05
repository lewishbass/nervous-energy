import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';


export class SmallMissile extends Projectile {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 13;
		this.explosionPower = 1;
		this.radius = 1.5;
		this.color = 0x000000;
		this.soundKey = 'bang';
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 } ) {
		//console.log('Small missile hit at ', collision.position);
		super.hit(collision);
	}
}