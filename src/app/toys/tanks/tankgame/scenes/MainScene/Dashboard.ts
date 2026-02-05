import Phaser from 'phaser';
import { Tank } from './Tank';
import { Terrain } from './Terrain';

export class Dashboard {
	private scene: Phaser.Scene;
	private containers: Phaser.GameObjects.Container[] = [];
	
	// Container 1 - Tank info
	private background1: Phaser.GameObjects.Rectangle;
	private nameText: Phaser.GameObjects.Text;
	private healthText: Phaser.GameObjects.Text;
	private fuelText: Phaser.GameObjects.Text;
	private nameColorMatrix: Phaser.FX.ColorMatrix;

	private tankSprite: Phaser.GameObjects.Sprite;
	private tankSpriteColorMatrix: Phaser.FX.ColorMatrix;
	private turret: Phaser.GameObjects.Graphics;

	private angleTankSprite: Phaser.GameObjects.Sprite;
	private angleTankSpriteColorMatrix: Phaser.FX.ColorMatrix;
	private angleTankTurret: Phaser.GameObjects.Graphics;

	private nameDrawer: Phaser.GameObjects.Graphics;
	private healthImage: Phaser.GameObjects.Image;
	private fuelImage: Phaser.GameObjects.Image;
	private repairImage: Phaser.GameObjects.Image;
	private parachuteImage: Phaser.GameObjects.Image;
	private teleporterImage: Phaser.GameObjects.Image;
	private repairText: Phaser.GameObjects.Text;
	private parachuteText: Phaser.GameObjects.Text;
	private teleporterText: Phaser.GameObjects.Text;
	private leftButton: Phaser.GameObjects.Triangle;
	private rightButton: Phaser.GameObjects.Triangle;
	private leftButtonPressed: boolean = false;
	private rightButtonPressed: boolean = false;
	
	// Container 2 - Combat controls
	private background2: Phaser.GameObjects.Rectangle;
	private powerText: Phaser.GameObjects.Text;
	private angleText: Phaser.GameObjects.Text;
	private fireButton: Phaser.GameObjects.Image;
	private fireButtonText: Phaser.GameObjects.Text;
	private powerIndicator: Phaser.GameObjects.Graphics;
	private powerBar: Phaser.GameObjects.Rectangle;
	private powerBarDragging: boolean = false;
	private maxPower: number = 0;
	
	// Power indicator constants
	private readonly powerTriX: number = -100;
	private readonly powerTriY: number = -3;
	private readonly powerTriWidth: number = 37;
	private readonly powerTriHeight: number = 110;
	
	// Angle indicator
	private angleIndicator: Phaser.GameObjects.Graphics;
	private angleBar: Phaser.GameObjects.Rectangle;
	private angleBarDragging: boolean = false;
	
	// Angle indicator constants
	private readonly angleBoxX: number = 47;
	private readonly angleBoxY: number = -45;
	private readonly angleBoxWidth: number = 150;
	private readonly angleBoxHeight: number = 21;
	
	// Container 3 - Arsenal and resources
	private background3: Phaser.GameObjects.Rectangle;
	private windText: Phaser.GameObjects.Text;
	private cashText: Phaser.GameObjects.Text;
	
	// Wind indicator
	private cloudImage: Phaser.GameObjects.Image;
	private cloudBrightness: Phaser.FX.ColorMatrix;
	private windArrow: Phaser.GameObjects.Graphics;
	
	// Weapon selection UI
	private weaponSelectionContainer: Phaser.GameObjects.Graphics;
	private weaponIcon: Phaser.GameObjects.Image;
	private weaponIconBackground: Phaser.GameObjects.Rectangle;
	private weaponNameText: Phaser.GameObjects.Text;
	private weaponNameBackground: Phaser.GameObjects.Rectangle;
	private weaponQuantityText: Phaser.GameObjects.Text;
	private weaponQuantityBackground: Phaser.GameObjects.Rectangle;
	private weaponLeftButton: Phaser.GameObjects.Triangle;
	private weaponRightButton: Phaser.GameObjects.Triangle;
	private weaponLeftButtonPressed: boolean = false;
	private weaponRightButtonPressed: boolean = false;
	
	// Container 4 - Reserved
	private background4: Phaser.GameObjects.Rectangle;
	private leaderboardTitle: Phaser.GameObjects.Text;
	private leaderboardNameEntries: Phaser.GameObjects.Text[] = [];
	private leaderboardScoreEntries: Phaser.GameObjects.Text[] = [];
	private readonly MAX_LEADERBOARD_ENTRIES = 8;

	public onMoveLeft?: () => void;
	public onMoveRight?: () => void;
	public onFire?: () => void;
	public onPowerChange?: (fraction: number) => void;
	public onAngleChange?: (angle: number) => void;
	public onWeaponScroll?: (delta: number) => void;
	
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		
		const containerWidth = 298;
		const containerHeight = 130;
		const spacing = 2;
		const startX = containerWidth / 2;
		
		// Container 1 - Tank info (left)
		const container1 = scene.add.container(startX, 65);
		container1.setDepth(10);
		this.containers.push(container1);
		
		this.background1 = scene.add.rectangle(0, 0, containerWidth, containerHeight, 0xffffff, 0.55);
		
		this.tankSprite = scene.add.sprite(-118, -40, 'player');
		this.tankSpriteColorMatrix = this.tankSprite.postFX.addColorMatrix();
		this.turret = scene.add.graphics();
		this.turret.setDepth(11);
		this.drawTurret(this.tankSprite.x, this.tankSprite.y, this.turret, -145);

		this.angleTankSprite = scene.add.sprite(30, -0, 'player');
		this.angleTankSpriteColorMatrix = this.angleTankSprite.postFX.addColorMatrix();
		this.angleTankTurret = scene.add.graphics();
		this.angleTankTurret.setDepth(11);
		this.drawTurret(this.angleTankSprite.x, this.angleTankSprite.y, this.angleTankTurret, 0);

		this.nameDrawer = scene.add.graphics();
		this.nameDrawer.lineStyle(2, 0xc9e3f0);
		this.nameDrawer.strokeRect(-160, -68, 225, 45);
		
		const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
			fontSize: '26px',
			color: '#000000',
			fontFamily: 'Arial'
		};
		
		this.nameText = scene.add.text(-100, -55, '', textStyle);
		this.nameText.setColor('#ff0000');
		this.fuelText = scene.add.text(-75, -13, '', textStyle);
		this.healthText = scene.add.text(-102, 29, '', textStyle);
		
		this.fuelImage = scene.add.image(-123, 1, 'fuel_dash');
		this.healthImage = scene.add.image(-123, 43, 'health');
		
		const gadgetY = 29;
		const startGadgetX = -25;
		const gadgetSpacing = 65;
		
		this.repairImage = scene.add.image(startGadgetX, gadgetY + 15, 'repair_kit_dash');
		this.repairText = scene.add.text(startGadgetX + 17, gadgetY, '', textStyle);
		
		this.parachuteImage = scene.add.image(startGadgetX + gadgetSpacing, gadgetY + 15, 'parachutes_dash');
		this.parachuteText = scene.add.text(startGadgetX + gadgetSpacing + 17, gadgetY, '', textStyle);
		
		this.teleporterImage = scene.add.image(startGadgetX + 2 * gadgetSpacing, gadgetY + 15, 'teleport_dash');
		this.teleporterText = scene.add.text(startGadgetX + 2 * gadgetSpacing + 17, gadgetY, '', textStyle);
		
		this.nameColorMatrix = this.nameText.postFX.addColorMatrix();
		this.nameColorMatrix.hue(0);
		
		const buttonY = 14;
		const buttonSize = 26;
		const leftButtonX = -70;
		const rightButtonX = -9;
		
		this.leftButton = scene.add.triangle(leftButtonX, buttonY, -buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x000000, 1);
		this.leftButton.setInteractive(new Phaser.Geom.Triangle(-buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
		this.leftButton.input!.cursor = 'pointer';
		
		this.rightButton = scene.add.triangle(rightButtonX, buttonY, buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x000000, 1);
		this.rightButton.setInteractive(new Phaser.Geom.Triangle(buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
		this.rightButton.input!.cursor = 'pointer';
		
		this.setupButtonInteractions();
		
		container1.add([
			this.background1, this.tankSprite, this.turret, this.nameDrawer, this.nameText,
			this.healthText, this.fuelText, this.leftButton, this.rightButton,
			this.healthImage, this.fuelImage, this.repairImage, this.repairText,
			this.parachuteImage, this.parachuteText, this.teleporterImage, this.teleporterText
		]);
		
		// Container 2 - Combat controls
		const container2X = startX + containerWidth + spacing;
		const container2 = scene.add.container(container2X, 65);
		container2.setDepth(10);
		this.containers.push(container2);
		
		this.background2 = scene.add.rectangle(0, 0, containerWidth, containerHeight, 0xffffff, 0.55);
		
		this.powerText = scene.add.text(-80, 30, '', textStyle);
		this.angleText = scene.add.text(70, -13, '', textStyle);
		
		// Power indicator triangle
		this.powerIndicator = scene.add.graphics();
		
		// Power bar (draggable)
		this.powerBar = scene.add.rectangle(this.powerTriX, this.powerTriY, this.powerTriWidth*1.1, 3, 0x000000, 1);
		this.powerBar.setInteractive({ draggable: true, cursor: 'pointer' });
		
		this.powerBar.on('dragstart', () => {
			this.powerBarDragging = true;
		});
		this.powerBar.on('pointerdown', () => {
			this.clickSound(0.5);
		});
		
		this.powerBar.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
			this.clickSound(0.1);

			// Clamp to triangle bounds
			const minY = this.powerTriY - this.powerTriHeight / 2;
			const clipY = minY + this.powerTriHeight * (1-this.maxPower / 100);
			const maxY = this.powerTriY + this.powerTriHeight / 2;
			const clampedY = Phaser.Math.Clamp(dragY, clipY, maxY);
			this.powerBar.y = clampedY;
			
			// Calculate power from position (inverted - top is max power)
			const fraction = (clampedY - minY) / (maxY - minY);
			if (this.onPowerChange) {
				this.onPowerChange(1 - fraction); // Invert so top is 100%
			}
		});
		
		this.powerBar.on('dragend', () => {
			this.powerBarDragging = false;
		});
		
		// Angle indicator box
		this.angleIndicator = scene.add.graphics();
		
		// Angle bar (draggable)
		this.angleBar = scene.add.rectangle(this.angleBoxX, this.angleBoxY, 3, this.angleBoxHeight * 1.1, 0x000000, 1);
		this.angleBar.setInteractive({ draggable: true, cursor: 'pointer' });
		
		this.angleBar.on('dragstart', () => {
			this.angleBarDragging = true;
		});
		this.angleBar.on('pointerdown', () => {
			this.clickSound(0.5);
		});
		
		this.angleBar.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
			this.clickSound(0.1);
			
			// Clamp to box bounds
			const minX = this.angleBoxX - this.angleBoxWidth / 2;
			const maxX = this.angleBoxX + this.angleBoxWidth / 2;
			const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
			this.angleBar.x = clampedX;
			
			// Calculate angle from position (left is -180, right is 0)
			const fraction = (clampedX - minX) / (maxX - minX);
			const angle = -180 + fraction * 180;
			if (this.onAngleChange) {
				this.onAngleChange(angle);
			}
		});
		
		this.angleBar.on('dragend', () => {
			this.angleBarDragging = false;
		});
		
		const buttonPos = { x: 95, y: 5 };
		
		this.fireButton = scene.add.image(0 + buttonPos.x, 35 + buttonPos.y, 'firebutton');
		this.fireButton.setInteractive();
		this.fireButton.input!.cursor = 'pointer';
		this.fireButtonText = scene.add.text(-29 + buttonPos.x, 22 + buttonPos.y	, 'FIRE', { fontSize: '26px', color: '#000000', fontFamily: 'Arial', fontStyle: 'bold' });
		this.fireButtonText.setInteractive();
		this.fireButtonText.input!.cursor = 'pointer';
		
		this.fireButton.on('pointerover', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.3,
				duration: 400,
				ease: 'Power2'
			});
		});
		this.fireButton.on('pointerout', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1,
				duration: 400,
				ease: 'Power2'
			});
		});
		this.fireButton.on('pointerdown', () => {
			this.clickSound();
			if (this.onFire) this.onFire();
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.2,
				duration: 150,
				ease: 'Power2'
			});
		});
		this.fireButton.on('pointerup', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.3,
				duration: 400,
				ease: 'Power2'
			});
		});
		this.fireButtonText.on('pointerover', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.3,
				duration: 400,
				ease: 'Power2'
			});
		});
		this.fireButtonText.on('pointerout', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1,
				duration: 400,
				ease: 'Power2'
			});
		});
			this.clickSound();
		this.fireButtonText.on('pointerdown', () => {
			this.clickSound();
			if (this.onFire) this.onFire();
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.2,
				duration: 150,
				ease: 'Power2'
			});
		});
		this.fireButtonText.on('pointerup', () => {
			this.scene.tweens.add({
				targets: this.fireButton,
				scale: 1.3,
				duration: 400,
				ease: 'Power2'
			});
		});
		
		container2.add([this.background2, this.powerIndicator, this.powerBar, this.powerText, this.angleText, this.fireButton, this.fireButtonText, this.angleTankSprite, this.angleTankTurret]);
		
		container2.add([this.angleIndicator, this.angleBar]);
		
		// Container 3 - Arsenal and resources
		const container3X = container2X + containerWidth + spacing;
		const container3 = scene.add.container(container3X, 65);
		container3.setDepth(10);
		this.containers.push(container3);
		
		this.background3 = scene.add.rectangle(0, 0, containerWidth, containerHeight, 0xffffff, 0.55);
		
		// Weapon selection UI at top
		const weaponLineWidth = 2;
		const weaponY = -41;
		const weaponMainWidth = 230;
		const weaponMainHeight = 30;
		const weaponIconSize = weaponMainHeight;
		const weaponQuantityWidth = weaponMainHeight;
		const weaponNameWidth = weaponMainWidth - weaponIconSize - weaponQuantityWidth - weaponLineWidth*2;
		
		// Weapon selection outline
		this.weaponSelectionContainer = scene.add.graphics();
		this.weaponSelectionContainer.lineStyle(weaponLineWidth*2, 0x000000);
		this.weaponSelectionContainer.strokeRect(-weaponMainWidth/2, weaponY - weaponMainHeight/2, weaponMainWidth, weaponMainHeight);
		
		// Icon section (gray background)
		this.weaponIconBackground = scene.add.rectangle(-weaponMainWidth / 2 + weaponIconSize / 2, weaponY, weaponIconSize, weaponMainHeight, 0xcccccc);
		this.weaponIcon = scene.add.image(-weaponMainWidth/2 + weaponIconSize/2, weaponY, 'missile');
		//this.weaponIcon.setDisplaySize(20, 20);
		this.weaponIcon.setScale(0.4);
		
		// Separator line after icon
		const sep1X = -weaponMainWidth/2 + weaponIconSize;
		this.weaponSelectionContainer.lineBetween(sep1X+weaponLineWidth/2, weaponY - weaponMainHeight/2, sep1X+weaponLineWidth/2, weaponY + weaponMainHeight/2);
		
		// Name section (white background)
		this.weaponNameBackground = scene.add.rectangle(sep1X + weaponNameWidth/2 + weaponLineWidth, weaponY, weaponNameWidth, weaponMainHeight, 0xffffff);
		this.weaponNameText = scene.add.text(sep1X + 5, weaponY - 12, 'Missile', { fontSize: '23px', color: '#000000', fontFamily: 'Arial', align: 'center', fixedWidth: weaponNameWidth +10 });
		
		// Separator line after name
		const sep2X = sep1X + weaponNameWidth;
		this.weaponSelectionContainer.lineBetween(sep2X + 3*weaponLineWidth/2, weaponY - weaponMainHeight/2, sep2X + 3*weaponLineWidth/2, weaponY + weaponMainHeight/2);
		
		// Quantity section (gray background)
		this.weaponQuantityBackground = scene.add.rectangle(sep2X + weaponQuantityWidth/2 + 2*weaponLineWidth, weaponY, weaponQuantityWidth, weaponMainHeight, 0xcccccc);
		this.weaponQuantityText = scene.add.text(sep2X + 2 * weaponLineWidth, weaponY - 12, '0', { fontSize: '23px', color: '#000000', fontFamily: 'Arial', align: 'center', fixedWidth: weaponQuantityWidth });
		
		// Arrow buttons
		const weaponLeftButtonX = -weaponMainWidth/2+7;
		const weaponRightButtonX = weaponMainWidth / 2 + 18;
		const weaponButtonY = weaponY+12;
		
		this.weaponLeftButton = scene.add.triangle(weaponLeftButtonX, weaponButtonY, -buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x000000, 1);
		this.weaponLeftButton.setInteractive(new Phaser.Geom.Triangle(-buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
		this.weaponLeftButton.input!.cursor = 'pointer';
		
		this.weaponRightButton = scene.add.triangle(weaponRightButtonX, weaponButtonY, buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x000000, 1);
		this.weaponRightButton.setInteractive(new Phaser.Geom.Triangle(buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
		this.weaponRightButton.input!.cursor = 'pointer';
		
		this.setupWeaponButtonInteractions();
		
		// Wind indicator with cloud and arrow
		const cloudX = 50;
		const cloudY = 15;
		this.cloudImage = scene.add.image(cloudX, cloudY, 'cloud');
		this.cloudBrightness = this.cloudImage.postFX.addColorMatrix();
		this.cloudImage.setScale(0.35);
		this.cloudBrightness.saturate(25);
		
		this.windArrow = scene.add.graphics();
		
		this.windText = scene.add.text(100, 20, '', textStyle);
		this.cashText = scene.add.text(-120, 20, '', {	 fontSize: '26px', color: '#666666', fontFamily: 'Arial' });
		
		container3.add([
			this.background3, 
			this.weaponSelectionContainer,
			this.weaponIconBackground,
			this.weaponIcon,
			this.weaponNameBackground,
			this.weaponNameText,
			this.weaponQuantityBackground,
			this.weaponQuantityText,
			this.weaponLeftButton,
			this.weaponRightButton,
			this.cloudImage,
			this.windArrow,
			this.windText, 
			this.cashText, 
		]);
		
		// Container 4 - Reserved
		const container4X = container3X + containerWidth + spacing;
		const container4 = scene.add.container(container4X, 65);
		container4.setDepth(10);
		this.containers.push(container4);
		
		this.background4 = scene.add.rectangle(0, 0, containerWidth, containerHeight, 0xffffff, 0.55);
		
		// Leaderboard title
		this.leaderboardTitle = scene.add.text(-140, -55, 'DAMAGE LEADERBOARD', {
			fontSize: '20px',
			color: '#000000',
			fontFamily: 'machine-font',
			fontStyle: 'bold'
		});
		
		// Create leaderboard entry texts (names and scores separately)
		const entryStartY = -25;
		const entrySpacing = 15;
		const scoreColumnX = 100; // X position for score column
		
		for (let i = 0; i < this.MAX_LEADERBOARD_ENTRIES; i++) {
			// Name text (left column)
			const nameText = scene.add.text(-140, entryStartY + i * entrySpacing, '', {
				fontSize: '16px',
				color: '#000000',
				fontFamily: 'machine-font'
			});
			this.leaderboardNameEntries.push(nameText);
			container4.add(nameText);
			
			// Score text (right column, right-aligned)
			const scoreText = scene.add.text(scoreColumnX, entryStartY + i * entrySpacing, '', {
				fontSize: '16px',
				color: '#000000',
				fontFamily: 'machine-font',
				align: 'right'
			});
			this.leaderboardScoreEntries.push(scoreText);
			container4.add(scoreText);
		}
		
		container4.add([this.background4, this.leaderboardTitle]);
	}
	
	clickSound(volume: number = 1) {
		this.scene.sound.play('click', { volume: volume * Phaser.Math.FloatBetween(0.4, 0.8), detune: Phaser.Math.Between(-200, 200) });
	}

	
	private setupButtonInteractions() {
		// Left button interactions
		this.leftButton.on('pointerover', () => {
			if (!this.leftButtonPressed) {
				this.leftButton.setAlpha(0.7);
			}
		});
		this.leftButton.on('pointerout', () => {
			if (!this.leftButtonPressed) {
				this.leftButton.setAlpha(1);
			}
		});
		this.leftButton.on('pointerdown', () => {
			this.clickSound();
			this.leftButtonPressed = true;
			this.leftButton.setFillStyle(0xff0000, 1);
		});
		this.leftButton.on('pointerup', () => {
			this.leftButtonPressed = false;
			this.leftButton.setFillStyle(0x000000, 1);
		});
		this.leftButton.on('pointerout', () => {
			if (this.leftButtonPressed) {
				this.leftButtonPressed = false;
				this.leftButton.setFillStyle(0x000000, 1);
			}
		});
		
		// Right button interactions
		this.rightButton.on('pointerover', () => {
			if (!this.rightButtonPressed) {
				this.rightButton.setAlpha(0.7);
			}
		});
		this.rightButton.on('pointerout', () => {
			if (!this.rightButtonPressed) {
				this.rightButton.setAlpha(1);
			}
		});
		this.rightButton.on('pointerdown', () => {
			this.clickSound();
			this.rightButtonPressed = true;
			this.rightButton.setFillStyle(0xff0000, 1);
		});
		this.rightButton.on('pointerup', () => {
			this.rightButtonPressed = false;
			this.rightButton.setFillStyle(0x000000, 1);
		});
		this.rightButton.on('pointerout', () => {
			if (this.rightButtonPressed) {
				this.rightButtonPressed = false;
				this.rightButton.setFillStyle(0x000000, 1);
			}
		});
	}
	
	private setupWeaponButtonInteractions() {
		// Left button interactions
		this.weaponLeftButton.on('pointerover', () => {
				this.weaponLeftButton.setAlpha(0.7);
		});
		this.weaponLeftButton.on('pointerout', () => {
				this.weaponLeftButton.setAlpha(1);
		});
		this.weaponLeftButton.on('pointerdown', () => {
			this.clickSound();
			this.weaponLeftButtonPressed = true;
			this.weaponLeftButton.setFillStyle(0xff0000, 1);
		});
		this.weaponLeftButton.on('pointerup', () => {
			if (this.weaponLeftButtonPressed && this.onWeaponScroll) {
				this.onWeaponScroll(-1);
			}
			this.weaponLeftButtonPressed = false;
			this.weaponLeftButton.setFillStyle(0x000000, 1);
		});
		this.weaponLeftButton.on('pointerout', () => {
			if (this.weaponLeftButtonPressed) {
				this.weaponLeftButtonPressed = false;
				this.weaponLeftButton.setFillStyle(0x000000, 1);
			}
		});
		
		// Right button interactions
		this.weaponRightButton.on('pointerover', () => {
				this.weaponRightButton.setAlpha(0.7);
		});
		this.weaponRightButton.on('pointerout', () => {
				this.weaponRightButton.setAlpha(1);
		});
		this.weaponRightButton.on('pointerdown', () => {
			this.clickSound();
			this.weaponRightButtonPressed = true;
			this.weaponRightButton.setFillStyle(0xff0000, 1);
		});
		this.weaponRightButton.on('pointerup', () => {
			if (this.weaponRightButtonPressed && this.onWeaponScroll) {
				this.onWeaponScroll(1);
			}
			this.weaponRightButtonPressed = false;
			this.weaponRightButton.setFillStyle(0x000000, 1);
		});
		this.weaponRightButton.on('pointerout', () => {
			if (this.weaponRightButtonPressed) {
				this.weaponRightButtonPressed = false;
				this.weaponRightButton.setFillStyle(0x000000, 1);
			}
		});
	}
	
	private drawTurret(x: number, y: number, turretGraphics: Phaser.GameObjects.Graphics, angle: number) {
		turretGraphics.clear();
		turretGraphics.lineStyle(3, 0x333333);
		
		const turretLength = 16;
		const turretOrigin = { x: 0, y: -3 };
		const turretAngle = angle;
		const absoluteAngle = Phaser.Math.DegToRad(turretAngle);
		const startX = x + turretOrigin.x;
		const startY = y + turretOrigin.y;
		const endX = startX + Math.cos(absoluteAngle) * turretLength;
		const endY = startY + Math.sin(absoluteAngle) * turretLength;
		
		turretGraphics.lineBetween(startX, startY, endX, endY);
		turretGraphics.strokePath();
		
		turretGraphics.lineStyle(4, 0x003300);
		turretGraphics.lineBetween(endX, endY, endX + Math.cos(absoluteAngle) * 6, endY + Math.sin(absoluteAngle) * 6);
	}
	
	private drawPowerIndicator(healthFraction: number, powerFraction: number) {
		this.powerIndicator.clear();
		
		// Draw upside-down triangle background (dark red)
		this.powerIndicator.fillStyle(0x660a0a, 1);
		this.powerIndicator.beginPath();
		this.powerIndicator.moveTo(this.powerTriX - this.powerTriWidth / 2, this.powerTriY - this.powerTriHeight / 2);
		this.powerIndicator.lineTo(this.powerTriX + this.powerTriWidth / 2, this.powerTriY - this.powerTriHeight / 2);
		this.powerIndicator.lineTo(this.powerTriX, this.powerTriY + this.powerTriHeight / 2);
		this.powerIndicator.closePath();
		this.powerIndicator.fillPath();
		
		// Calculate fill height based on health
		const fillHeight = this.powerTriHeight * (1-healthFraction);
		const fillY = this.powerTriY + this.powerTriHeight / 2;
		const fillWidth = this.powerTriWidth * healthFraction
		
		// Draw filled portion using clip path
		if (healthFraction > 0) {
			
			this.powerIndicator.beginPath();
			this.powerIndicator.moveTo(this.powerTriX + fillWidth / 2, this.powerTriY - this.powerTriHeight / 2 + fillHeight);
			this.powerIndicator.lineTo(this.powerTriX - fillWidth / 2, this.powerTriY - this.powerTriHeight / 2 + fillHeight);
			this.powerIndicator.lineTo(this.powerTriX, this.powerTriY + this.powerTriHeight / 2);
			this.powerIndicator.closePath();
			
			this.powerIndicator.fillGradientStyle(0xff0000, 0xff0000, 0xffeeee, 0xffeeee, 1);
			this.powerIndicator.fillPath();
		}
		
		// Update power bar position if not being dragged
		if (!this.powerBarDragging) {
			const minY = this.powerTriY - this.powerTriHeight / 2;
			const maxY = this.powerTriY + this.powerTriHeight / 2;
			const barY = minY + (1 - powerFraction) * (maxY - minY); // Inverted
			this.powerBar.y = barY;
		}
	}
	
	private drawAngleIndicator(angle: number) {
		this.angleIndicator.clear();
		
		// Draw background box
		this.angleIndicator.fillStyle(0x333333, 1);
		this.angleIndicator.fillRect(this.angleBoxX - this.angleBoxWidth / 2, this.angleBoxY - this.angleBoxHeight / 2, this.angleBoxWidth, this.angleBoxHeight);
		
		// Draw gradient fill (white-red-white)
		const steps = 50;
		for (let i = 0; i < steps; i++) {
			const x = this.angleBoxX - this.angleBoxWidth / 2 + (i / steps) * this.angleBoxWidth;
			const w = this.angleBoxWidth / steps;
			
			// Calculate color: white at edges, red in middle
			const progress = Math.abs(i / steps - 0.5) * 2; // 0 at center, 1 at edges
			const r = 255;
			const g = Math.floor(255 * progress);
			const b = Math.floor(255 * progress);
			const color = (r << 16) | (g << 8) | b;
			
			this.angleIndicator.fillStyle(color, 1);
			this.angleIndicator.fillRect(x, this.angleBoxY - this.angleBoxHeight / 2, w, this.angleBoxHeight);
		}
		
		// Update angle bar position if not being dragged
		if (!this.angleBarDragging) {
			const minX = this.angleBoxX - this.angleBoxWidth / 2;
			const maxX = this.angleBoxX + this.angleBoxWidth / 2;
			const fraction = (angle + 180) / 180; // Convert -180 to 0 range to 0-1
			const barX = minX + fraction * (maxX - minX);
			this.angleBar.x = barX;
		}
	}
	
	private drawWindArrow(windSpeed: number) {
		this.windArrow.clear();
		
		
		const arrowY = 40; // Below cloud
		const arrowX = 50;
		const maxArrowLength = 40;
		const arrowLength = Phaser.Math.Clamp(Math.abs(windSpeed/50)**0.75, 0.2, 3) * maxArrowLength;
		const direction = windSpeed > 0 ? 1 : -1; // Right for positive, left for negative

		
		
		// Draw arrow shaft
		this.windArrow.lineStyle(3, 0x333333, 1);
		this.windArrow.lineBetween(arrowX - direction * arrowLength / 2, arrowY, arrowX + direction * arrowLength / 2, arrowY);
		if (Math.abs(windSpeed) < 1) return;
		// Draw arrowhead
		const headSize = 10;
		const headX = arrowX + direction * (arrowLength / 2+3);
		this.windArrow.lineStyle(3, 0x333333, 1);
		this.windArrow.beginPath();
		this.windArrow.moveTo(headX - direction * headSize, arrowY - headSize / 2);
		this.windArrow.lineTo(headX, arrowY);
		this.windArrow.lineTo(headX - direction * headSize, arrowY + headSize / 2);
		this.windArrow.strokePath();
	}
	
	update(tank: Tank, terrain: Terrain, tanks: Tank[]) {
		this.maxPower = Math.min(tank.health, 100);
		tank.power = Math.min(tank.power, this.maxPower);

		this.nameColorMatrix.hue(tank.hue);
		this.angleTankSpriteColorMatrix.hue(tank.hue);
		this.tankSpriteColorMatrix.hue(tank.hue);
		this.nameText.setText(`${tank.name || 'Unnamed'}`);
		this.fuelText.setText(`${Phaser.Math.Clamp(Math.floor(tank.fuel), 0, 999)}`);
		this.healthText.setText(`${Math.floor(tank.health)}`);
		
		this.repairText.setText(`${tank.gadgets.repair_kit}`);
		this.parachuteText.setText(`${tank.gadgets.parachutes}`);
		this.teleporterText.setText(`${tank.gadgets.teleport}`);
		
		const powerFraction = tank.getPower() / 100;
		const healthFraction = Math.min(1, tank.health / 100);
		
		this.drawPowerIndicator(healthFraction, powerFraction);
		this.drawAngleIndicator(tank.getTurretAngle());
		
		this.powerText.setText(`${tank.getPower().toFixed(0)}`);
		this.angleText.setText(`${Math.floor(180 + tank.getTurretAngle())}`);
		this.drawTurret(this.angleTankSprite.x, this.angleTankSprite.y, this.angleTankTurret, tank.getTurretAngle());
		
		const windSpeed = terrain.getWindSpeed();
		this.drawWindArrow(windSpeed);
		this.windText.setText(`${Math.abs(windSpeed).toFixed(0)}`);
		this.cashText.setText(`$ ${tank.cash.toLocaleString()}`);
		
		// Update weapon selection display
		const selectedWeapon = tank.selectedWeapon;
		if (tank.arsenal[selectedWeapon]) {
			const weaponCount = tank.arsenal[selectedWeapon] || 0;
		
			// Update weapon icon
			if (this.scene.textures.exists(selectedWeapon)) {
				this.weaponIcon.setTexture(selectedWeapon);
				this.weaponIcon.setVisible(true);
			}
		
			// Format weapon name (replace underscores with spaces, capitalize)
			const formattedName = selectedWeapon.split('_').map(word =>
				word.charAt(0).toUpperCase() + word.slice(1)
			).join(' ');
			this.weaponNameText.setText(formattedName);
			this.weaponQuantityText.setText(`${Phaser.Math.Clamp(weaponCount, 0, 99)}`);
		} else {
			this.weaponNameText.setText('Out of Ammo');
			this.weaponQuantityText.setText('');
			this.weaponIcon.setVisible(false);
		}
		
		
		if (this.leftButtonPressed && this.onMoveLeft) {
			this.onMoveLeft();
		}
		if (this.rightButtonPressed && this.onMoveRight) {
			this.onMoveRight();
		}
		
		// Update leaderboard
		this.updateLeaderboard(tanks);
	}
	
	private updateLeaderboard(tanks: Tank[]) {
		// Sort tanks by current round damage (last element in roundDamage array)
		const sortedTanks = [...tanks]
			.filter(t => t.alive) // Only show alive tanks
			.sort((a, b) => {
				const aDamage = a.roundDamage.length > 0 ? a.roundDamage[a.roundDamage.length - 1] : 0;
				const bDamage = b.roundDamage.length > 0 ? b.roundDamage[b.roundDamage.length - 1] : 0;
				return bDamage - aDamage; // Sort descending
			});
		
		// Update each entry
		for (let i = 0; i < this.MAX_LEADERBOARD_ENTRIES; i++) {
			if (i < sortedTanks.length) {
				const tank = sortedTanks[i];
				const damage = tank.roundDamage.length > 0 ? tank.roundDamage[tank.roundDamage.length - 1] : 0;
				const displayName = tank.name || 'Unnamed';
				
				// Update name with darkened player color
				this.leaderboardNameEntries[i].setText(`${i + 1}. ${displayName}`);
				const darkenedColor = Phaser.Display.Color.ValueToColor(tank.color);
				darkenedColor.brighten(-30); // Darken by 30%
				this.leaderboardNameEntries[i].setColor(darkenedColor.rgba);
				this.leaderboardNameEntries[i].setVisible(true);
				
				// Update score in black, right-aligned
				this.leaderboardScoreEntries[i].setText(`${Math.floor(damage)}`);
				this.leaderboardScoreEntries[i].setColor('#000000');
				this.leaderboardScoreEntries[i].setVisible(true);
			} else {
				this.leaderboardNameEntries[i].setVisible(false);
				this.leaderboardScoreEntries[i].setVisible(false);
			}
		}
	}

	destroy() {
		this.containers.forEach(c => c.destroy());
	}
}
