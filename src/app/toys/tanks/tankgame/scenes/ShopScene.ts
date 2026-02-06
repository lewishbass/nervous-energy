import Phaser from "phaser";
import { Tank } from "./MainScene/Tank";
import { line } from "d3";
import { tan } from "@tensorflow/tfjs-core";
import { use } from "matter";


interface ShopItemType {
	iconName: string;
	price: number;
	bundleSize: number;
	getNBought: (tank: Tank) => number;
	buy: (tank: Tank, num: number) => void;
}

interface ShopButtonType {
	item: Phaser.GameObjects.Container;
	setter: (tank: Tank) => void;
}


// ShopScene.js
export class ShopScene extends Phaser.Scene {

	private callingScene: Phaser.Scene | string = "";
	
	private leftDoor!: Phaser.GameObjects.Image;
	private rightDoor!: Phaser.GameObjects.Image

	private leftContent!: Phaser.GameObjects.Container;
	private rightContent!: Phaser.GameObjects.Container;

	private tanks: Tank[] = [];
	private activeTankIndex: number = 0;

	private buttons: ShopButtonType[] = [];
	private cashText!: Phaser.GameObjects.Text;
	private nameText!: Phaser.GameObjects.Text;
	private nameBackground!: Phaser.GameObjects.Rectangle;

	private closeBtnText!: Phaser.GameObjects.Text;
	private closeBtnBackground!: Phaser.GameObjects.Rectangle;

	private shopItems: ShopItemType[] = [
		{
			iconName: 'small_missile',
			price: 1000,
			bundleSize: 10,
			getNBought: (tank: Tank) => tank.getArsenal('small_missile'),
			buy: (tank: Tank, num: number) => tank.addArsenal('small_missile', num)
		},
		{
			iconName: 'missile',
			price: 2000,
			bundleSize: 5,
			getNBought: (tank: Tank) => tank.getArsenal('missile'),
			buy: (tank: Tank, num: number) => tank.addArsenal('missile', num)
		},
		{
			iconName: 'small_atom_bomb',
			price: 5000,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getArsenal('small_atom_bomb'),
			buy: (tank: Tank, num: number) => tank.addArsenal('small_atom_bomb', num)
		},
		{
			iconName: 'atom_bomb',
			price: 13000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getArsenal('atom_bomb'),
			buy: (tank: Tank, num: number) => tank.addArsenal('atom_bomb', num)
		},
		{
			iconName: 'volcano_bomb',
			price: 8000,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getArsenal('volcano_bomb'),
			buy: (tank: Tank, num: number) => tank.addArsenal('volcano_bomb', num)
		},
		{
			iconName: 'shower',
			price: 9000,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getArsenal('shower'),
			buy: (tank: Tank, num: number) => tank.addArsenal('shower', num)
		},
		{
			iconName: 'hot_shower',
			price: 30000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getArsenal('hot_shower'),
			buy: (tank: Tank, num: number) => tank.addArsenal('hot_shower', num)
		},
		{
			iconName: 'small_ball',
			price: 5000,
			bundleSize: 5,
			getNBought: (tank: Tank) => tank.getArsenal('small_ball'),
			buy: (tank: Tank, num: number) => tank.addArsenal('small_ball', num)
		},
		{
			iconName: 'ball',
			price: 6000,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getArsenal('ball'),
			buy: (tank: Tank, num: number) => tank.addArsenal('ball', num)
		},
		{
			iconName: 'large_ball',
			price: 15000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getArsenal('large_ball'),
			buy: (tank: Tank, num: number) => tank.addArsenal('large_ball', num)
		},
		{
			iconName: 'small_ball_v2',
			price: 6500,
			bundleSize: 5,
			getNBought: (tank: Tank) => tank.getArsenal('small_ball_v2'),
			buy: (tank: Tank, num: number) => tank.addArsenal('small_ball_v2', num)
		},
		{
			iconName: 'ball_v2',
			price: 7500,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getArsenal('ball_v2'),
			buy: (tank: Tank, num: number) => tank.addArsenal('ball_v2', num)
		},
		{
			iconName: 'large_ball_v2',
			price: 18000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getArsenal('large_ball_v2'),
			buy: (tank: Tank, num: number) => tank.addArsenal('large_ball_v2', num)
		},
		{
			iconName: 'air_strike',
			price: 25000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getArsenal('air_strike'),
			buy: (tank: Tank, num: number) => tank.addArsenal('air_strike', num)
		},



		{
			iconName: 'parachutes',
			price: 5000,
			bundleSize: 5,
			getNBought: (tank: Tank) => tank.getGadget('parachutes'),
			buy: (tank: Tank, num: number) => tank.addGadget('parachutes', num)
		},
		{
			iconName: 'repair_kit',
			price: 4000,
			bundleSize: 5,
			getNBought: (tank: Tank) => tank.getGadget('repair_kit'),
			buy: (tank: Tank, num: number) => tank.addGadget('repair_kit', num)
		},
		{
			iconName: 'fuel',
			price: 3000,
			bundleSize: 50,
			getNBought: (tank: Tank) => Math.floor(tank.maxFuel / 50),
			buy: (tank: Tank, num: number) => tank.maxFuel += num
		},
		{
			iconName: 'weak_shield',
			price: 5000,
			bundleSize: 2,
			getNBought: (tank: Tank) => tank.getShield('weak_shield'),
			buy: (tank: Tank, num: number) => tank.addShield('weak_shield', num)
		},
		{
			iconName: 'shield',
			price: 10000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getShield('shield'),
			buy: (tank: Tank, num: number) => tank.addShield('shield', num)
		},
		{
			iconName: 'strong_shield',
			price: 15000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getShield('strong_shield'),
			buy: (tank: Tank, num: number) => tank.addShield('strong_shield', num)
		},
		{
			iconName: 'super_shield',
			price: 20000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getShield('super_shield'),
			buy: (tank: Tank, num: number) => tank.addShield('super_shield', num)
		},
		{
			iconName: 'teleport',
			price: 15000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.getGadget('teleport'),
			buy: (tank: Tank, num: number) => tank.addGadget('teleport', num)
		},
		{
			iconName: 'upgrade_energy',
			price: 5000,
			bundleSize: 10,
			getNBought: (tank: Tank) => tank.maxHealth - 100,
			buy: (tank: Tank, num: number) => tank.maxHealth += num
		},
		{
			iconName: 'upgrade_armor',
			price: 10000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.armor * 5,
			buy: (tank: Tank, num: number) => tank.armor += num / 5
		},
		{
			iconName: 'upgrade_engine',
			price: 7000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.fuelEfficiency,
			buy: (tank: Tank, num: number) => tank.fuelEfficiency += num
		},
		{
			iconName: 'upgrade_hill_mov',
			price: 5000,
			bundleSize: 1,
			getNBought: (tank: Tank) => tank.climbSlope * 5,
			buy: (tank: Tank, num: number) => tank.climbSlope += num / 5
		}
	];


	createShopItemButton(item: ShopItemType, x: number, y: number): ShopButtonType {
		
		const lineWidth = 2;
		const buttonHeight = 32;

		let xOffset = 0;

		const lineGraphics = this.add.graphics();
		lineGraphics.lineStyle(lineWidth, 0x000000);

		const iconBackground = this.add.rectangle(xOffset, 0, buttonHeight, buttonHeight, 0xcccccc).setOrigin(0, 0.5);
		const icon = this.add.image(xOffset + buttonHeight / 2, 0, item.iconName).setOrigin(0.5, 0.5);
		icon.setScale(0.4);

		xOffset += buttonHeight;
		lineGraphics.moveTo(xOffset + lineWidth / 2, -buttonHeight / 2);
		lineGraphics.lineTo(xOffset + lineWidth / 2, buttonHeight / 2);
		lineGraphics.strokePath();
		xOffset += lineWidth;

		const weaponNameWidth = 200;
		const formattedName = item.iconName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		const nameBackground = this.add.rectangle(xOffset, 0, weaponNameWidth, buttonHeight, 0xeeeeee).setOrigin(0, 0.5);
		const nameText = this.add.text(xOffset, 0, formattedName, { fontSize: '23px', color: '#000000', fontFamily: 'Arial', align: 'center', fixedWidth: weaponNameWidth }).setOrigin(0, 0.5);
		
		xOffset += weaponNameWidth;
		lineGraphics.moveTo(xOffset + lineWidth / 2, -buttonHeight / 2);
		lineGraphics.lineTo(xOffset + lineWidth / 2, buttonHeight / 2);
		lineGraphics.strokePath();
		xOffset += lineWidth;

		const priceTextWidth = 90;
		const priceBox = this.add.rectangle(xOffset, 0, priceTextWidth, buttonHeight, 0xcccccc).setOrigin(0, 0.5);
		const priceText = this.add.text(xOffset, 0, `${item.price}`, { fontSize: '23px', color: '#000000', fontFamily: 'Arial', align: 'center', fixedWidth: priceTextWidth }).setOrigin(0, 0.5);

		xOffset += priceTextWidth;
		lineGraphics.moveTo(xOffset + lineWidth / 2, -buttonHeight / 2);
		lineGraphics.lineTo(xOffset + lineWidth / 2, buttonHeight / 2);
		lineGraphics.strokePath();
		xOffset += lineWidth;

		const weaponQuantityWidth = buttonHeight;
		const quantityBox = this.add.rectangle(xOffset, 0, weaponQuantityWidth, buttonHeight, 0xcccccc).setOrigin(0, 0.5);
		const quantityText = this.add.text(xOffset, 0, `${item.bundleSize}`, { fontSize: '23px', color: '#000000', fontFamily: 'Arial', align: 'center', fixedWidth: weaponQuantityWidth }).setOrigin(0, 0.5);

		xOffset += weaponQuantityWidth;
		lineGraphics.moveTo(xOffset + lineWidth / 2, -buttonHeight / 2);
		lineGraphics.lineTo(xOffset + lineWidth / 2, buttonHeight / 2);
		lineGraphics.strokePath();
		xOffset += lineWidth;

		const ownedBoxWidth = buttonHeight * 1.5;
		const ownedBox = this.add.rectangle(xOffset, 0, ownedBoxWidth, buttonHeight, 0x666666).setOrigin(0, 0.5);
		const ownedText = this.add.text(xOffset, 0, `0`, { fontSize: '23px', color: '#ffffff', fontFamily: 'Arial', align: 'center', fixedWidth: ownedBoxWidth }).setOrigin(0, 0.5);
		
		xOffset += ownedBoxWidth;

		const outline = this.add.rectangle(0 - lineWidth / 2, 1 - lineWidth / 2, xOffset + lineWidth, buttonHeight + lineWidth, 0x00ff00, 0).setOrigin(0, 0.5);
		outline.setStrokeStyle(lineWidth, 0x000000);


		const container = this.add.container(x, y, [iconBackground, icon, nameBackground, nameText, priceBox, priceText, quantityBox, quantityText, ownedBox, ownedText, outline, lineGraphics]);
		
		// Make all children ignore pointer events so container receives them
		container.iterate((child: Phaser.GameObjects.GameObject) => {
			if ('setInteractive' in child) {
				(child as any).disableInteractive();
			}
		});
		
		container.setInteractive(new Phaser.Geom.Rectangle(0, -buttonHeight / 2, xOffset, buttonHeight), Phaser.Geom.Rectangle.Contains);
		container.input!.cursor = 'pointer';
		container.on('pointerover', () => {
			this.tweens.killTweensOf(outline);
			this.clickSound(0.125);
			this.tweens.add({ // TODO set outline color to black when unaffordable
				targets: outline,
				duration: 150,
				ease: 'Quad.easeOut',
				fillAlpha: 0.15,
			});
		});
		container.on('pointerout', () => {
			this.tweens.killTweensOf(outline);
			this.tweens.add({
				targets: outline,
				duration: 400,
				ease: 'Quad.easeOut',
				fillAlpha: 0,
			});
			this.tweens.killTweensOf(container);
			this.tweens.add({
				targets: container,
				duration: 600,
				ease: 'Quad.easeOut',
				y: y,
			});
		});
		

		return {
			item: container,
			setter: (tank: Tank) => {
				ownedText.setText(`${item.getNBought(tank).toFixed(0)}`);
				if (tank.cash < item.price) {
					nameText.setColor('#888888');
					outline.setFillStyle(0x888888, 0.3);
					container.input!.enabled = false;
				} else {
					nameText.setColor('#000000');
					outline.setFillStyle(0x00ff00, 0);
					container.input!.enabled = true;
				}
				//clear previous pointerdown listeners to prevent stacking
				container.removeAllListeners('pointerdown');
				container.on('pointerdown', () => {
					if (tank.cash >= item.price) {
						this.clickSound(1.2, (-item.price / 1000) * 80 + 160);
						tank.cash -= item.price;
						item.buy(tank, item.bundleSize);
						this.updateShop(tank);
						this.tweens.killTweensOf(container);
						this.tweens.add({
							targets: container,
							duration: 150,
							ease: 'Quad.easeOut',
							y: container.y + 2,
						});
					}
				});
				container.removeAllListeners('pointerup');
				container.on('pointerup', () => {
					this.clickSound(0.7, (-item.price / 1000) * 80 + 360);
					this.tweens.killTweensOf(container);
					this.tweens.add({
						targets: container,
						duration: 150,
						ease: 'Quad.easeOut',
						y: y,
					});
				});
			}
			
		};
			
	}
	clickSound(volume: number = 1, detune: number = 0) {
		this.sound.play('click', { volume: volume * Phaser.Math.FloatBetween(0.4, 0.8), detune: detune + Phaser.Math.Between(-200, 200) });
		}
	

	updateShop(tank: Tank) {
		this.buttons.forEach(button => button.setter(tank));
		this.nameText.setText(tank.name);
		this.nameText.setColor(`#${tank.color.toString(16).padStart(6, '0')}`);
		this.cashText.setText(`$ ${tank.cash.toLocaleString()}`);
		this.nameBackground.setSize(this.nameText.width + 10, this.nameBackground.height);
		if (this.activeTankIndex < this.tanks.length - 1) {
			this.closeBtnText.setText('NEXT PLAYER');
		} else {
			this.closeBtnText.setText('START');
		}
	}

	constructor() {
		super({ key: 'ShopScene' });
	}

	preload() {
		// Load door texture
		this.load.image('doors', '/tanks/shop_s.webp');
		
	}

	init(data: { callingScene: Phaser.Scene | string, tanks?: Tank[] }) {
		// Receive data from calling scene
		this.callingScene = data.callingScene || 'MainScene';
		this.tanks = data.tanks || [];
		this.activeTankIndex = 0;
		// Clear buttons array on init
		this.buttons = [];
	}

	create() {
		const { width, height } = this.cameras.main;

		// Create left and right door panels with texture
		this.leftDoor = this.add.image(0, height / 2, 'doors');
		this.leftDoor.setDisplaySize(width, height);
		this.leftDoor.setOrigin(0.5, 0.5);
		this.leftDoor.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
		
		this.rightDoor = this.add.image(width, height / 2, 'doors');
		this.rightDoor.setDisplaySize(width, height);
		this.rightDoor.setOrigin(0.5, 0.5);
		this.rightDoor.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		// Set crop for left door to show left half
		const doorTexture = this.textures.get('doors');
		const doorWidth = doorTexture.getSourceImage().width;
		const doorHeight = doorTexture.getSourceImage().height;
		this.leftDoor.setCrop(0, 0, doorWidth / 2, doorHeight);
		
		// Set crop for right door to show right half
		this.rightDoor.setCrop(doorWidth / 2, 0, doorWidth / 2, doorHeight);

		// Content containers (hidden initially)
		this.leftContent = this.add.container(width / 4, height / 2);
		this.leftContent.setAlpha(0);
		this.rightContent = this.add.container(3 * width / 4, height / 2);
		this.rightContent.setAlpha(0);

		// Add your shop content to the containers
		this.createShopContent();
		
		// Update buttons after they're created
		if (this.tanks.length > 0) {
			this.updateShop(this.tanks[this.activeTankIndex]);
		}


		// Play open animation
		this.openDoors();
	}


	createShopContent() {
		// Left door content

		// cash display
		this.cashText = this.add.text(-100, -420, '$ 0', { fontSize: '23px', color: '#ffff00', fontFamily: 'Arial', align: 'center' }).setOrigin(0, 0.5);
		this.leftContent.add(this.cashText);

		// name display
		this.nameText = this.add.text(-100, -380, 'joe', { fontSize: '23px', color: '#ffffff', fontFamily: 'Arial', align: 'left', fontStyle: 'bold' }).setOrigin(0, 0.5);
		this.nameBackground = this.add.rectangle(-105, -382, this.nameText.width + 10, 36, 0xffffff, 0.3).setOrigin(0, 0.5);
		this.leftContent.add([this.nameBackground, this.nameText]);


		// shop display
		this.shopItems.forEach((item, index) => {
			const yOffset = -300 + (index % 14) * 40;
			const shopItemDisplay = this.createShopItemButton(item, -180, yOffset);
			if (index < 14) this.leftContent.add(shopItemDisplay.item);
			else this.rightContent.add(shopItemDisplay.item);
			this.buttons.push(shopItemDisplay);
		});


		this.closeBtnText = this.add.text(0, 200, 'CLOSE', { fontSize: '47px', letterSpacing: 1.5, fontFamily: 'machine-font', color: '#980000'})
			.setOrigin(0.5)
		
		this.closeBtnBackground = this.add.rectangle(0, 200, 250, this.closeBtnText.height - 5, 0xffffff, 0.35)
			.setOrigin(0.5).setInteractive({ useHandCursor: true });
		
		this.closeBtnBackground.on('pointerover', () => {
			this.tweens.add({
				targets: this.closeBtnBackground,
				duration: 300,
				ease: 'Quad.easeOut',
				fillAlpha: 0.9,
			});
		});
		this.closeBtnBackground.on('pointerout', () => {
			this.tweens.add({
				targets: this.closeBtnBackground,
				duration: 300,
				ease: 'Quad.easeOut',
				fillAlpha: 0.35,
			});
		});
		this.closeBtnBackground.on('pointerdown', () => {
			this.closeBtnHandler();
		});

		this.rightContent.add([this.closeBtnBackground, this.closeBtnText]);
	}

	closeBtnHandler() {
		if (this.activeTankIndex < this.tanks.length - 1) {
			this.activeTankIndex++;
			this.updateShop(this.tanks[this.activeTankIndex]);
			this.clickSound(0.8);
		} else {
			this.closeDoors();
			this.sound.play('click', {detune: Phaser.Math.Between(-200, -300) } );
		}
	}

	openDoors() {
		this.sound.play('doors', { volume: 0.75, detune: Phaser.Math.Between(-100, 100) });
		
		const { width } = this.cameras.main;

		// Slide doors to center
		this.tweens.add({
			targets: this.leftDoor,
			x: width / 2,
			duration: 1200,
			ease: 'Quad.easeOut'
		});

		this.tweens.add({
			targets: this.rightDoor,
			x: width / 2,
			duration: 1200,
			ease: 'Quad.easeOut',
			onComplete: () => {

				// Pause the main scene
				this.scene.pause(this.callingScene);
				// Fade in content after doors meet
				this.tweens.add({
					targets: [this.leftContent, this.rightContent],
					alpha: 1,
					duration: 300
				});
			}
		});
	}

	closeDoors() {
		this.sound.play('doors', { volume: 0.35, detune: Phaser.Math.Between(-100, 100) });
		const { width } = this.cameras.main;
		// Resume main scene and stop shop
		this.scene.resume(this.callingScene);

		// Fade out content first
		this.tweens.add({
			targets: [this.leftContent, this.rightContent],
			alpha: 0,
			duration: 200,
			onComplete: () => {
				// Then slide doors open
				this.tweens.add({
					targets: this.leftDoor,
					x: 0,
					duration: 900,
					ease: 'Quad.easeIn'
				});

				this.tweens.add({
					targets: this.rightDoor,
					x: width,
					duration: 900,
					ease: 'Quad.easeIn',
					onComplete: () => {
						this.scene.stop();
					}
				});
			}
		});
	}
}
