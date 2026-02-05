import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';

export class Missile extends Projectile {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 20;
		this.explosionPower = 1.5;
		this.radius = 2;
		this.color = 0xff0000;
		this.soundKey = 'bang';
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2 } ) {
		//console.log('Missile hit at ', collision.position);
		super.hit(collision);
	}
}