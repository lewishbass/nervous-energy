import Phaser from 'phaser';
import { Projectile } from '../Projectile';
import { Tank } from '../Tank';

class VolcanoBomb extends Projectile {
	
	public nSpews: number = 5;

	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);
		
		// Set explosion properties
		this.explosionRadius = 13;
		this.explosionPower = 1;
		this.radius = 2;
		this.color = 0x000000;
		this.soundKey = 'bang';
	}
	
	hit( collision: { type: 'terrain' | 'tank' | 'bounds' | null, target?: any, position?: Phaser.Math.Vector2, normal?: Phaser.Math.Vector2 } ) {
		if (!collision.position || !collision.normal) {
			super.hit(collision);
			console.warn('VolcanoBomb hit without position or normal');
			return;
		}
		console.log(11)
		collision.normal.scale(200)
		for (let i = 0; i < this.nSpews; i++) {
			const r = new Phaser.Math.Vector2(Phaser.Math.Between(-60, 60), Phaser.Math.Between(-60, 60));
			const spew = new VolcanoSpew(this.scene, collision.position.x, collision.position.y, collision.normal.x + r.x, collision.normal.y+r.y, this.windSpeed, this.projectiles, this.parentTank);
			this.projectiles.push(spew);
		}

		super.hit(collision);
	}
}

class VolcanoSpew extends Projectile {


	constructor(scene: Phaser.Scene, x: number, y: number, vx: number, vy: number, windSpeed: number, projectiles: Projectile[], parentTank: Tank) {
		super(scene, x, y, vx, vy, windSpeed, projectiles, parentTank);

		// Set explosion properties
		this.explosionRadius = 13;
		this.explosionPower = 2;
		this.radius = 1.5;
		this.color = 0x2222221;
		this.intangibleTime = 0.1;
		this.soundKey = 'crack';
	}
	hitsound() {
			this.scene.sound.play(this.soundKey, { volume: 0.25-0.5*Math.exp(-this.explosionPower+Phaser.Math.FloatBetween(-1, 1)), detune: Phaser.Math.Between(-10, 200) - 10*(this.explosionRadius-60) });
		}
}

export { VolcanoBomb, VolcanoSpew };