import { Shower, ShowerPayload } from './shower';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';

class HotShower extends Shower {

	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		this.explosionRadius = 30;
		this.explosionPower = 3;
		this.radius = 3;
		this.color = 0xff4500;

		this.payloadType = HotShowerPayload;
		this.soundKey = 'boom';
	}
}

class HotShowerPayload extends ShowerPayload {
	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		this.explosionPower = 2.5;
		this.explosionRadius = 25;
		this.radius = 2;
		this.color = 0xff3300;
		this.soundKey = 'bang';
	}
}

export { HotShower, HotShowerPayload };