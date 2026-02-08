import Phaser from 'phaser';

	class MenuScene extends Phaser.Scene {

		private callingScene: Phaser.Scene | string = "";
		private logo!: Phaser.GameObjects.Image;
		private blackScreen!: Phaser.GameObjects.Rectangle;
		private menuBackground!: Phaser.GameObjects.Image;
		private leftContainer!: Phaser.GameObjects.Container;
		private rightContainer!: Phaser.GameObjects.Container;
		private startButtonContainer!: Phaser.GameObjects.Container;
		private linkButtonContainer!: Phaser.GameObjects.Container;
		
		private selectedTerrain: string = 'random';
		private selectedPlayers: number = 2;
		private selectingNumber: number = -1;

		private playerSelectionContainer!: Phaser.GameObjects.Container;
		private aiOptionsContainer!: Phaser.GameObjects.Container;
		private playerText!: Phaser.GameObjects.Text;
		private nameInputBox!: Phaser.GameObjects.DOMElement;
		private colorOptions: Array<string> = [
			'#e61919',
			'#03c703',
			'#1e1ecf',
			'#000000',
			'#ffff3d',
			'#c47f00',
		];
		private colorButtons: Record<string, Phaser.GameObjects.Container> = {};
		private aiOptions: Record<string, string> = {
			'VERY EASY': '#33ff33',
			'EASY': '#9eff66',
			'NORMAL': '#ffcc00',
			'HARD': '#ff6600',
			'VERY HARD': '#ff3333',
		};
		private aiCheckMark!: Phaser.GameObjects.Text;
		private aiOptionButtons: Record<string, Phaser.GameObjects.Container> = {};

		private playerInfo: { name: string; color: string; isAI: boolean; aiDifficulty: string }[] = [];
		private inDoorAnimation: boolean = false;
		
		private terrainButtons: Phaser.GameObjects.Container[] = [];
		private playerCountText!: Phaser.GameObjects.Text;
		private playerCountCircleBg!: Phaser.GameObjects.Arc;
		private leftArrow!: Phaser.GameObjects.Triangle;
		private rightArrow!: Phaser.GameObjects.Triangle;
		private nextPlayerText!: Phaser.GameObjects.Text;

		private doLogo: boolean = true;

		private leftDoor!: Phaser.GameObjects.Image;
		private rightDoor!: Phaser.GameObjects.Image;

		constructor() {
			super({ key: 'MenuScene' });
		}

		preload() {
			// Load menu assets
			this.load.image('logo', '/tanks/FullLogo.svg');
			this.load.image('menuBackground', '/tanks/menu_s.webp');
			this.load.image('arrow', '/tanks/arrow.svg');
			this.load.image('doors', '/tanks/shop_s.webp');

			// load audio
			this.sound.unlock();
			this.load.audio('doors', '/tanks/sounds/doors.mp3');
			this.load.audio('click', '/tanks/sounds/click.mp3');
			
			// Load font
			this.load.font('machine-font', '/tanks/mf.otf');
		}



		create() {
			const { width, height } = this.cameras.main;
			
			// Menu background (initially hidden)
			this.menuBackground = this.add.image(width / 2, height / 2, 'menuBackground');
			this.menuBackground.setDisplaySize(width, height);
			this.menuBackground.setAlpha(0);
			this.menuBackground.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
			
			// Black screen
			this.blackScreen = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
			
			// Create logo image (initially hidden, off-screen top)
			this.logo = this.add.image(width / 2, -150, 'logo');
			this.logo.setAlpha(0);
			
			// Create menu containers (initially hidden)
			this.leftContainer = this.add.container(0, 0);
			this.leftContainer.setAlpha(0);
			
			this.rightContainer = this.add.container(0, 0);
			this.rightContainer.setAlpha(0);
			
			this.startButtonContainer = this.add.container(0, 0);
			this.startButtonContainer.setAlpha(0);
			
			this.createMenuContent();

			// Create door panels
			this.leftDoor = this.add.image(0, height / 2, 'doors');
			this.leftDoor.setDisplaySize(width, height);
			this.leftDoor.setOrigin(0.5, 0.5).setDepth(200);  // anchor to right edge
			this.leftDoor.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
			this.rightDoor = this.add.image(width, height / 2, 'doors');
			this.rightDoor.setDisplaySize(width, height);
			this.rightDoor.setOrigin(0.5, 0.5).setDepth(200);  // anchor to left edge
			this.rightDoor.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

			// Set crop for left door to show left half
			const doorTexture = this.textures.get('doors');
			const doorWidth = doorTexture.getSourceImage().width;
			const doorHeight = doorTexture.getSourceImage().height;
			this.leftDoor.setCrop(0, 0, doorWidth / 2, doorHeight);
			
			// Set crop for right door to show right half
			this.rightDoor.setCrop(doorWidth / 2, 0, doorWidth / 2, doorHeight);
			
			this.createPlayerSelectionContent();
			this.playerSelectionContainer.setAlpha(0);
			this.aiOptionsContainer.setAlpha(0);
			
			// Start logo animation sequence
			if (this.doLogo) this.animateLogo();
			else this.fadeToMenu();
		}

		private animateLogo() {
			const { width, height } = this.cameras.main;
			
			// Step 1: Fade in logo and move to center (slide down)
			this.tweens.add({
				targets: this.logo,
				y: height * 0.4,
				alpha: 1,
				duration: 1000,
				ease: 'linear',
				onComplete: () => {
					// Step 2: Scale to 0.8
					this.tweens.add({
						targets: this.logo,
						scaleY: 0.7,
						scaleX:1.1,
						duration: 300,
						ease: 'linear',
						onComplete: () => {
							// Step 3: Scale to 1
							this.tweens.add({
								targets: this.logo,
								scaleY: 1,
								scaleX: 1,
								duration: 300,
								ease: 'linear',
								onComplete: () => {
									// Step 4: Wait a moment, then fade out logo and black screen together
									this.time.delayedCall(500, () => {
										this.fadeToMenu();
									});
								}
							});
						}
					});
				}
			});
		}

		private fadeToMenu() {
			// Fade in menu background
			this.tweens.add({
				targets: this.menuBackground,
				alpha: 1,
				duration: 600,
				ease: 'Power2'
			});
			
			// Fade out logo and black screen simultaneously
			this.tweens.add({
				targets: [this.logo, this.blackScreen],
				alpha: 0,
				duration: 600,
				ease: 'Power2',
				onComplete: () => {
					// Show menu after fade complete
					this.showMenu();
				}
			});
		}

		private createMenuContent() {
			const { width, height } = this.cameras.main;
			
			const containerWidth = 320;
			const containerHeight = 500;
			const gap = 30;
			const leftX = containerWidth / 2 + 120;
			const rightX = leftX + containerWidth + gap;
			const containerY =  containerHeight / 2 + height*0.35;
			
			// Create left container (Terrain & Players)
			this.createLeftContainer(leftX, containerY, containerWidth, containerHeight);
			
			// Create right container (Controls)
			this.createRightContainer(rightX, containerY, containerWidth, containerHeight);
			
			// Create start button below containers
			this.createStartButton(width - 100, height - 100);
			
			// Create link button in lower left
			this.createLinkButton();
			
			this.updateTerrainSelection();
		}

		clickSound() {
			this.sound.play('click', { volume: Phaser.Math.FloatBetween(0.4, 0.8), detune: Phaser.Math.Between(-200, 200) });
		}
		
		private createLeftContainer(x: number, y: number, width: number, height: number) {
			// Background
			const bg = this.add.graphics();
			bg.fillStyle(0xe6ebc9, 0.6);
			bg.fillRoundedRect(-width / 2, -height / 2, width, height, 40);
			this.leftContainer.add(bg);
			
			let currentY = -height / 2 + 43;
			
			// Terrain Type Title
			const terrainTitle = this.add.text(0, currentY, 'TERRAIN TYPE', {
				fontSize: '52px',
				fontFamily: 'machine-font',
				color: '#000000',
				fontStyle: 'bold',
				letterSpacing: 2,
			}).setOrigin(0.5).setScale(1, 1.1);
			this.leftContainer.add(terrainTitle);
			
			currentY += 55;
			
			// Terrain Radio Buttons
			const terrains = [
				{ name: 'Mountains', key: 'mountains' },
				{ name: 'Forest', key: 'forest' },
				{ name: 'Desert', key: 'desert' },
				{ name: 'Random', key: 'random' }
			];
			
			terrains.forEach((terrain, index) => {
				const buttonY = currentY + index * 49;
				
				const button = this.add.container(0, buttonY);
				
				const circle = this.add.circle(-111, 0, 17, 0xffffff, 0.9);
				circle.setStrokeStyle(2.5, 0x000000);
				
				const innerCircle = this.add.circle(-111, 0, 9.5, 0x006600, 0);
				
				const text = this.add.text(-70, 0, terrain.name, {
					fontSize: '36px',
					fontFamily: 'machine-font',
					color: '#333333'
				}).setOrigin(0, 0.5).setScale(1, 1.05);
				
				button.add([circle, innerCircle, text]);
				button.setInteractive(new Phaser.Geom.Rectangle(-width/2, -15, width, 30), Phaser.Geom.Rectangle.Contains);
				button.setData('terrain', terrain.key);
				button.setData('innerCircle', innerCircle);
				button.input!.cursor = 'pointer';
				
				button.on('pointerover', () => {
					text.setStyle({ color: '#222222' });
				});
				button.on('pointerout', () => {
					text.setStyle({ color: '#333333' });
				});
				button.on('pointerdown', () => {
					this.clickSound();
					this.selectedTerrain = terrain.key;
					this.updateTerrainSelection();
				});
				
				this.terrainButtons.push(button);
				this.leftContainer.add(button);
			});
			
			currentY += 49 * terrains.length + 10;
			
			// Players Title
			const playerTitle = this.add.text(0, currentY, 'PLAYERS', {
				fontSize: '52px',
				fontFamily: 'machine-font',
				color: '#000000',
				fontStyle: 'bold',
				letterSpacing: 2,
			}).setOrigin(0.5).setScale(1, 1.1);
			this.leftContainer.add(playerTitle);
			
			currentY += 50;
			
			// Players Subtitle
			const playerSubtitle = this.add.text(0, currentY+30, 
				'TOTAL PLAYERS WITH COMPUTER\nCONTROLLED(2 PLAYERS =\n1 HUMAN VS 1 COMPUTER\nOR 2 HUMANS)',
				{
					fontSize: '26px',
					fontFamily: 'machine-font',
					color: '#333333',
					align: 'center',
					lineSpacing: -3
				}
			).setOrigin(0.5);
			this.leftContainer.add(playerSubtitle);
			
			currentY += 110;

			// Circle around player count
			this.playerCountCircleBg = this.add.circle(-100, currentY-1, 22, 0xffffff, 0.9);
			this.playerCountCircleBg.setStrokeStyle(3, 0x000000);
			this.leftContainer.add(this.playerCountCircleBg);
			
			// Player Count
			this.playerCountText = this.add.text(-100, currentY, '2', {
				fontSize: '40px',
				fontFamily: 'machine-font',
				color: '#000000',
				fontStyle: 'bold'
			}).setOrigin(0.5);
			this.leftContainer.add(this.playerCountText);
			
			const buttonSize = 33;
			const leftArrowX = -9;
			const rightArrowX = 9;
			const arrowY = currentY+17;
			
			this.leftArrow = this.add.triangle(leftArrowX, arrowY, -buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x333333, 1);
			this.leftArrow.setInteractive(new Phaser.Geom.Triangle(-buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
			this.leftArrow.on('pointerover', () => this.leftArrow.setFillStyle(0x777777, 1));
			this.leftArrow.on('pointerout', () => this.leftArrow.setFillStyle(0x333333, 1));
			this.leftArrow.on('pointerdown', () => {
				this.clickSound();
				this.selectedPlayers = Math.max(2, this.selectedPlayers - 1);
				if (this.selectedPlayers < 10) this.playerCountCircleBg.setRadius(22);
				this.playerCountText.setText(this.selectedPlayers.toString());
				this.leftArrow.setFillStyle(0xee0000, 1);
			});
			this.leftArrow.on('pointerup', () => {
				this.leftArrow.setFillStyle(0x333333, 1);
			});
			this.leftArrow.input!.cursor = 'pointer';
			this.leftContainer.add(this.leftArrow);
			
			this.rightArrow = this.add.triangle(rightArrowX, arrowY, buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2, 0x333333, 1);
			this.rightArrow.setInteractive(new Phaser.Geom.Triangle(buttonSize, 0, 0, -buttonSize/2, 0, buttonSize/2), Phaser.Geom.Triangle.Contains);
			this.rightArrow.on('pointerover', () => this.rightArrow.setFillStyle(0x777777, 1));
			this.rightArrow.on('pointerout', () => this.rightArrow.setFillStyle(0x333333, 1));
			this.rightArrow.on('pointerdown', () => {
				this.clickSound();
				this.selectedPlayers = Math.min(16, this.selectedPlayers + 1);
				if(this.selectedPlayers>9)this.playerCountCircleBg.setRadius(25);
				this.playerCountText.setText(this.selectedPlayers.toString());
				this.rightArrow.setFillStyle(0xee0000, 1);
			});
			this.rightArrow.on('pointerup', () => {
				this.rightArrow.setFillStyle(0x333333, 1);
			});
			this.rightArrow.input!.cursor = 'pointer';
			this.leftContainer.add(this.rightArrow);
			
			this.leftContainer.setPosition(x, y);
		}
		
		private createRightContainer(x: number, y: number, width: number, height: number) {
			// Background
			const bg = this.add.graphics();
			bg.fillStyle(0xe6ebc9, 0.6);
			bg.fillRoundedRect(-width / 2, -height / 2, width, height, 40);
			this.rightContainer.add(bg);
			
			let currentY = -height / 2 + 40;
			
			// Controls Title
			const controlsTitle = this.add.text(0, currentY, 'CONTROLS', {
				fontSize: '52px',
				fontFamily: 'machine-font',
				color: '#000000',
				fontStyle: 'bold',
				letterSpacing: 3,
			}).setOrigin(0.5).setScale(1, 1.1);
			this.rightContainer.add(controlsTitle);
			
			currentY += 110;
			
			// Controls List
			const controlsList = [
				{ label: 'LEFT & RIGHT ARROW', desc: 'MOVE' },
				{ label: 'UP & DOWN ARROW', desc: 'CANON ROTATION' },
				{ label: '"PGUP & PGDN or "W" & "S"', desc: 'FIRE POWER' },
				{ label: '"A" & "D"', desc: 'CHANGE WEAPON' },
				{ label: 'SPACE', desc: 'FIRE' }
			];
			
			controlsList.forEach((control, index) => {
				const itemY = currentY + index * 70;
				
				const labelText = this.add.text(0, itemY, control.label, {
					fontSize: '26px',
					fontFamily: 'machine-font',
					color: '#333333',
					align: 'center'
				}).setOrigin(0.5);
				
				const descText = this.add.text(0, itemY + 28, control.desc, {
					fontSize: '26px',
					fontFamily: 'machine-font',
					color: '#333333',
					align: 'center',
					lineSpacing: -3
				}).setOrigin(0.5);
				
				this.rightContainer.add([labelText, descText]);
			});
			
			this.rightContainer.setPosition(x, y);
		}

		private createPlayerSelectionContent() {
			const cwidth = 450;
			const cheight = 320;
			const bg = this.add.graphics();
			bg.fillStyle(0xe6ebc9, 0.6);
			bg.fillRoundedRect(cwidth / -2, 30+cheight / -2, cwidth, cheight, 40);
			
			let yoffset = -cheight / 2 + 80;
			const sectionSpacing = 50;

			// title text
			this.playerText = this.add.text(0, yoffset, `PLAYER ${this.selectingNumber}`,
				{
					fontSize: '52px',
					fontFamily: 'machine-font',
					color: '#000000',
					fontStyle: 'bold',
					letterSpacing: 2,
				}
			).setOrigin(0.5).setScale(1, 1.1);
			yoffset += 80;
			
			// Name input box
			const nameText = this.add.text(-cwidth/2 + 40, yoffset, 'NAME:', {
				fontSize: '32px',
				fontFamily: 'machine-font',
				color: '#333333',
				letterSpacing: 2,
			}).setOrigin(0, 0.5);

			// Create DOM input element
			this.nameInputBox = this.add.dom(-86, yoffset).createFromHTML(`
				<input type="text" 
					maxlength="15" 
					placeholder=""
					autocomplete="off"
					autocorrect="off"
					spellcheck="false"
					style="
						width: 250px;
						height: 35px;
						font-size: 24px;
						font-family: machine-font, monospace;
						padding: 5px 2px;
						border: 2px solid #333333;
						background-color: #ffffff;
						outline: none;
						color: #333333;
						transform: scaleY(1.2);
					"
				/>
			`);
			this.nameInputBox.setOrigin(0, 0.5);

			// Add event listener for name input changes
			const inputElement = this.nameInputBox.node.querySelector('input') as HTMLInputElement;
			if (inputElement) {
				inputElement.addEventListener('input', (e) => {
					this.clickSound();
					const target = e.target as HTMLInputElement;
					if (this.selectingNumber > 0 && this.selectingNumber <= this.playerInfo.length) {
						this.playerInfo[this.selectingNumber - 1].name = target.value;
					}
				});
			}

			yoffset += sectionSpacing;

			// Color Input 
			const colorText = this.add.text(-cwidth/2 + 40, yoffset, 'COLOR:', {
				fontSize: '32px',
				fontFamily: 'machine-font',
				color: '#333333',
				letterSpacing: 2,
			}).setOrigin(0, 0.5);

			// radio buttons
			const radioContainer = this.add.container(0, yoffset);
			this.colorOptions.forEach((colorname, index) => {
				const button = this.add.container(index * 42-60, 0);
				

				const circle = this.add.circle(0, 0, 15, Phaser.Display.Color.HexStringToColor(colorname).brighten(30).color, 0.85);
				circle.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(colorname).brighten(-10).color);

				const innerCircle = this.add.circle(0, 0, 8, 0x006600, 0);
				button.add([circle, innerCircle]);
				button.setInteractive(new Phaser.Geom.Circle(0, 0, 15), Phaser.Geom.Circle.Contains);
				button.input!.cursor = 'pointer';
				button.on('pointerdown', () => {
					this.clickSound();
					this.playerInfo[this.selectingNumber - 1].color = colorname;
					this.updatePlayerSelectionContent();
				});

				this.colorButtons[colorname] = button;
				radioContainer.add(button);
			});

			yoffset += sectionSpacing;

			// AI checkbox
			const aiText = this.add.text(-cwidth/2 + 40, yoffset, 'COMPUTER CONTROLLED:', {
				fontSize: '32px',
				fontFamily: 'machine-font',
				color: '#333333',
				letterSpacing: 2,
			}).setOrigin(0, 0.5);

			const aiCheckbox = this.add.container(148, yoffset);
			const boxSize = 35;
			const box = this.add.rectangle(0, 0, boxSize, boxSize, 0xffffff, 0);
			box.setStrokeStyle(2, 0x000000);
			const checkMark = this.add.text(6, -5, '✓', {
				fontSize: '58px',
				fontFamily: 'machine-font',
				color: '#000000',
			}).setOrigin(0.5);
			checkMark.setVisible(false);
			aiCheckbox.add([box, checkMark]);
			this.aiCheckMark = checkMark;
			aiCheckbox.setInteractive(new Phaser.Geom.Rectangle(-boxSize / 2, -boxSize / 2, boxSize, boxSize), Phaser.Geom.Rectangle.Contains);
			aiCheckbox.input!.cursor = 'pointer';
			aiCheckbox.on('pointerdown', () => {
				this.clickSound();
				const info = this.playerInfo[this.selectingNumber - 1];
				info.isAI = !info.isAI;
				this.updatePlayerSelectionContent();
			});
			
			yoffset += sectionSpacing;

			//navigation

			this.nextPlayerText = this.add.text(0, yoffset, 'Next Player', {
				fontSize: '44px',
				color: '#000000',
				fontFamily: 'machine-font',
				letterSpacing: 2,
			}).setOrigin(0.5);

			const nextPlayerButton = this.add.image(160, yoffset, 'arrow');
			nextPlayerButton.setScale(0.8);
			nextPlayerButton.setInteractive();
			nextPlayerButton.on('pointerover', () => nextPlayerButton.setScale(0.85));
			nextPlayerButton.on('pointerout', () => nextPlayerButton.setScale(0.8));
			nextPlayerButton.on('pointerdown', () => {
				this.clickSound();
				if (this.selectingNumber < this.selectedPlayers) {
					this.selectingNumber += 1;
					this.updatePlayerSelectionContent();
				}
				else this.startGame();
			});
			nextPlayerButton.input!.cursor = 'pointer';

			const lastPlayerButton = this.add.image(-160, yoffset, 'arrow');
			lastPlayerButton.setScale(0.8);
			lastPlayerButton.setAlpha(0.6);
			lastPlayerButton.setFlipX(true);
			lastPlayerButton.setInteractive();
			lastPlayerButton.on('pointerover', () => lastPlayerButton.setScale(0.85));
			lastPlayerButton.on('pointerout', () => lastPlayerButton.setScale(0.8));
			lastPlayerButton.on('pointerdown', () => {
				this.clickSound();
				if (this.selectingNumber > 1) {
					this.selectingNumber -= 1;
					this.updatePlayerSelectionContent();
				} else {
					// door animate back to main menu
					this.playDoorAnimation(
						() => {
							this.playerSelectionContainer.setAlpha(0);
							this.aiOptionsContainer.setAlpha(0);
							this.showMenu();
						}
					)
				}
			});
			lastPlayerButton.input!.cursor = 'pointer';
			this.playerSelectionContainer = this.add.container(0, 0);



			const {width, height} = this.cameras.main;
			this.playerSelectionContainer = this.add.container(width / 2, height / 2, [bg, this.playerText, nameText, this.nameInputBox, colorText, aiText, this.nextPlayerText, radioContainer, nextPlayerButton, aiCheckbox, lastPlayerButton]);
			
			this.createAIOptionsContent(width, height, cheight);
		}

		private createAIOptionsContent(width: number, height: number, cheight: number) {
			const cwidth = 230;
			const bg = this.add.graphics();
			bg.fillStyle(0xe6ebc9, 0.6);
			bg.fillRoundedRect(cwidth / -2, 30+cheight / -2, cwidth, cheight, 40);
			
			let yoffset = -cheight / 2 + 60;

			// Title
			const aiDifficultyTitle = this.add.text(0, yoffset, 'AI DIFFICULTY:', {
				fontSize: '32px',
				fontFamily: 'machine-font',
				color: '#333333',
				fontStyle: 'bold',
				letterSpacing: 2,
			}).setOrigin(0.5).setScale(1, 1.1);

			yoffset += 50;

			// Create radio buttons for AI difficulty
			const aiRadioContainer = this.add.container(0, 0);
			Object.keys(this.aiOptions).forEach((difficulty, index) => {
				const buttonY = yoffset + index * 50;
				
				const button = this.add.container(0, buttonY);
				
				const circle = this.add.circle(80, 0, 15, Phaser.Display.Color.HexStringToColor(this.aiOptions[difficulty]).brighten(40).color, 0.9);
				circle.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(this.aiOptions[difficulty]).brighten(-50).color);
				
				const innerCircle = this.add.circle(80, 0, 8, Phaser.Display.Color.HexStringToColor(this.aiOptions[difficulty]).color, 0);
				
				const text = this.add.text(-90, 0, difficulty, {
					fontSize: '32px',
					fontFamily: 'machine-font',
					color: '#333333',
					fontStyle: 'bold',
					letterSpacing: 2,
				}).setOrigin(0, 0.5).setScale(1, 1.1);
				
				button.add([circle, innerCircle, text]);
				button.setInteractive(new Phaser.Geom.Rectangle(-cwidth/2, -15, cwidth, 30), Phaser.Geom.Rectangle.Contains);
				button.input!.cursor = 'pointer';
				
				button.on('pointerover', () => {
					text.setTint(0xcccccc);
				});
				button.on('pointerout', () => {
					text.clearTint();
				});
				button.on('pointerdown', () => {
					this.clickSound();
					if (this.selectingNumber > 0 && this.selectingNumber <= this.playerInfo.length) {
						this.playerInfo[this.selectingNumber - 1].aiDifficulty = difficulty;
						this.updateAIOptionsContent();
					}
				});
				
				this.aiOptionButtons[difficulty] = button;
				aiRadioContainer.add(button);
			});

			this.aiOptionsContainer = this.add.container(width / 2 + 360, height / 2, [bg, aiDifficultyTitle, aiRadioContainer]);
		}

		private updateAIOptionsContent() {
			if (this.selectingNumber > 0 && this.selectingNumber <= this.playerInfo.length) {
				const info = this.playerInfo[this.selectingNumber - 1];
				
				// Update radio button selection
				Object.keys(this.aiOptionButtons).forEach(difficulty => {
					const button = this.aiOptionButtons[difficulty];
					const innerCircle = button.getAt(1) as Phaser.GameObjects.Arc;
					if (difficulty === info.aiDifficulty) {
						innerCircle.setFillStyle(Phaser.Display.Color.HexStringToColor(this.aiOptions[difficulty]).brighten(-15).color, 1);
					} else {
						innerCircle.setFillStyle(Phaser.Display.Color.HexStringToColor(this.aiOptions[difficulty]).brighten(-15).color, 0);
					}
				});
			}
		}

		private updatePlayerSelectionContent() {
			while(this.playerInfo.length < this.selectingNumber) {
				this.playerInfo.push({ name: ``, color: '#000000', isAI: false, aiDifficulty: 'NORMAL' });
			}
			this.playerText.setText(`PLAYER ${this.selectingNumber}`);
			if (this.selectingNumber === this.selectedPlayers) this.nextPlayerText.setText('START !');
			else this.nextPlayerText.setText('NEXT PLAYER');

			if (this.selectingNumber <= this.playerInfo.length && this.selectingNumber > 0) {
				const info = this.playerInfo[this.selectingNumber - 1];
				
				// Update name input box value
				const inputElement = this.nameInputBox.node.querySelector('input') as HTMLInputElement;
				if (inputElement) {
					inputElement.value = info.name;
				}
				
				// update color selection
				Object.keys(this.colorButtons).forEach(colorname => {
					const button = this.colorButtons[colorname];
					const innerCircle = button.getAt(1) as Phaser.GameObjects.Arc;
					if (colorname === info.color) {
						innerCircle.setFillStyle(0x006600, 1);
					} else {
						innerCircle.setFillStyle(0x006600, 0);
					}
				});
				// update AI checkbox
				const checkMark = this.aiCheckMark;
				if (info.isAI) {
					checkMark.setVisible(true);
					// Fade in AI options container
					this.tweens.add({
						targets: this.aiOptionsContainer,
						alpha: 1,
						duration: 600,
						ease: 'Power2'
					});
				} else {
					checkMark.setVisible(false);
					// Fade out AI options container
					this.tweens.add({
						targets: this.aiOptionsContainer,
						alpha: 0,
						duration: 600,
						ease: 'Power2'
					});
				}

				this.updateAIOptionsContent();
			}
		}

		
		
		private createStartButton(x: number, y: number) {
			const startArrow = this.add.image(0, 0, 'arrow');
			startArrow.setInteractive();
			startArrow.on('pointerover', () => startArrow.setScale(1.01));
			startArrow.on('pointerout', () => startArrow.setScale(1));
			startArrow.on('pointerdown', () => {
				this.clickSound();
				this.playDoorAnimation(
					() => {
						this.leftContainer.setAlpha(0);
						this.rightContainer.setAlpha(0);
						this.startButtonContainer.setAlpha(0);
						this.playerSelectionContainer.setAlpha(1);
						this.selectingNumber = 1;
						this.updatePlayerSelectionContent();
					},
				)
			}, null);
			startArrow.input!.cursor = 'pointer';
			
			this.startButtonContainer.add(startArrow);
			this.startButtonContainer.setPosition(x, y);
		}

		private createLinkButton() {
			const buttonWidth = 350;
			const buttonHeight = 80;
			const { width, height } = this.cameras.main;

			
			// Create rectangle button
			const buttonRect = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0xffffff, 0.0);
			buttonRect.setInteractive();
			buttonRect.on('pointerdown', () => {
				window.open('https://www.mathsisfun.com/games/tanks.html', '_blank'); // Replace with actual link
			});
			buttonRect.input!.cursor = 'pointer';
			
			
			// Create container for button
			const linkButtonContainer = this.add.container(buttonWidth / 2, height-buttonHeight / 2, [buttonRect]);
			linkButtonContainer.setAlpha(0); // Initially hidden like other menu elements
			
			// Add to scene (assuming it's part of the menu, fade in with others)
			this.add.existing(linkButtonContainer);
			this.linkButtonContainer = linkButtonContainer;
		}

		private showMenu() {
			this.tweens.add({
				targets: [this.leftContainer, this.rightContainer, this.startButtonContainer, this.linkButtonContainer], // Add linkButtonContainer to fade in
				alpha: 1,
				duration: 800,
				ease: 'Power2'
			});
		}

		private updateTerrainSelection() {
			this.terrainButtons.forEach(button => {
				const innerCircle = button.getData('innerCircle') as Phaser.GameObjects.Arc;
				if (button.getData('terrain') === this.selectedTerrain) {
					innerCircle.setFillStyle(0x006600, 1);
				} else {
					innerCircle.setFillStyle(0x006600, 0);
				}
			});
		}

		private playDoorAnimation(onMiddle: () => void | null, onComplete?: () => void | null, midWait: number = 200) {
			// avoid playing multiple door animations at once
			if(this.inDoorAnimation)return;
			this.inDoorAnimation = true;
			//fade out dom elements
			this.tweens.add({
				targets: this.nameInputBox,
				scaleX: 0,
				duration: 300,
				ease: 'Power2'
			});

			this.sound.play('doors', { volume: 0.75, detune: Phaser.Math.Between(-100, 100) });

			const { width } = this.cameras.main;
			// Set doors to high depth to ensure they stay on top
			this.leftDoor.setDepth(1000);
			this.rightDoor.setDepth(1000);
			
			// slide door closed animation
			this.tweens.add({
				targets: [this.leftDoor, this.rightDoor],
				x: {
					getStart: (target: Phaser.GameObjects.Image) => target.x,
					getEnd: (target: Phaser.GameObjects.Image) => width/2,
				},
				duration: 1200,
				ease: 'Quad.easeOut',
				onComplete: () => {
					// Call onMiddle when doors are closed
					if (onMiddle) onMiddle();
					
					setTimeout(() => {
						// slide doors open animation
						this.tweens.add({
							targets: [this.leftDoor, this.rightDoor],
							x: {
								getStart: (target: Phaser.GameObjects.Image) => target.x,
								getEnd: (target: Phaser.GameObjects.Image) => {
									if (target === this.leftDoor) return 0;
									else return width;
								},
							},
							duration: 1000,
							ease: 'Quad.easeIn',
							onComplete: () => {
								// fade in dom elements
								this.tweens.add({
									targets: this.nameInputBox,
									scaleX: 1,
									duration: 300,
									ease: 'Power2'
								});
								if (onComplete) onComplete();
								this.inDoorAnimation = false;
							}
						});
					}, midWait);
				}
			
			});
		}

		private startGame() {
			// animate out menu
			this.playDoorAnimation(
				() => { // halfway point - doors closed
					this.playerSelectionContainer.setAlpha(0);
					this.aiOptionsContainer.setAlpha(0);
					this.menuBackground.setAlpha(0);
					this.leftContainer.setAlpha(0);
					this.rightContainer.setAlpha(0);
					this.startButtonContainer.setAlpha(0);
					
					// Launch MainScene below this scene
					this.scene.launch('MainScene', {
						terrain: this.selectedTerrain,
						players: this.selectedPlayers,
						playerInfo: this.playerInfo.slice(0, this.selectedPlayers)
					});
					
					// Bring MenuScene to top to ensure doors render over MainScene
					this.scene.bringToTop();
				},
				() => { // when complete - doors open again revealing main scene
					this.scene.stop();
				},
				500
			);
		}
	}

	export { MenuScene };