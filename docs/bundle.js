
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var PhaserTemplate = (function () {
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var phaser_min$1 = {exports: {}};

var phaser_min = phaser_min$1.exports;

(function (module, exports) {
} (phaser_min$1, phaser_min$1.exports));

var phaser_minExports = phaser_min$1.exports;
var Phaser$1 = /*@__PURE__*/getDefaultExportFromCjs(phaser_minExports);

/**
 * Boot scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class Boot extends phaser_minExports.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image('background', 'assets/bg.png');
    }
    create() {
        this.scene.start('Preloader');
    }
}

/**
 * This is the class that makes the sprite the player plays.
 *
 * Author: Flynn Rundquist
 * Version: 1.0
 * Since: 2024-06-06
 */
class Player extends phaser_minExports.Physics.Arcade.Sprite {
    constructor(config, health, score) {
        super(config.scene, config.x, config.y, config.texture);
        Object.defineProperty(this, "cursors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "health", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        Object.defineProperty(this, "score", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Enable physics
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        // Set collide with world bounds
        this.setCollideWorldBounds(true);
        // Create cursor keys
        this.cursors = config.scene.input.keyboard?.createCursorKeys() || null;
        // Health and score
        this.health = health;
        this.score = score;
        // Apply gravity (have to clarify the type of body)
        this.body.setGravityY(300);
    }
    update() {
        if (!this.cursors)
            return;
        const speed = 100;
        // Horizontal movement
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-speed);
        }
        else if (this.cursors.right?.isDown) {
            this.setVelocityX(speed);
        }
        else {
            this.setVelocityX(0);
        }
        // Jumping
        if (this.cursors.up?.isDown) {
            this.setVelocityY(-150);
        }
    }
}

/**
 * Enemy sprites.
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class Enemy extends phaser_minExports.Physics.Arcade.Sprite {
    constructor(config, health = 10) {
        super(config.scene, config.x, config.y, config.key);
        Object.defineProperty(this, "health", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cursors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.health = health;
        // Enable physics
        config.scene.physics.world.enable(this);
        // Enable gravity
        this.setGravity(100);
        // Set collide world bounds
        this.setCollideWorldBounds(true);
    }
    // Add enemy to the scene
    static addEnemy(scene, x, y, key, health) {
        const enemy = new Enemy({ scene, x, y, key }, health);
        scene.add.existing(enemy);
        return enemy;
    }
    // If player hits enemy, enemy loses health
    hitEnemy(player, cursors) {
        if (cursors.space.isDown) {
            this.health -= 10;
            player.score += 10;
        }
    }
    // If enemy hits player, player loses 10 health
    hitPlayer(player) {
        player.health -= 10;
    }
    update(player, cursors) {
        this.cursors = cursors;
        if (this.health <= 0) {
            this.destroy();
            player.score += 10;
            return;
        }
        // Make enemy move towards player if within 400 pixels
        const XdistanceToPlayer = player.x - this.x;
        if (Math.abs(XdistanceToPlayer) < 400) {
            this.setVelocityX(XdistanceToPlayer > 0 ? 150 : -150);
        }
        else {
            this.setVelocityX(0);
        }
        const YdistanceToPlayer = Math.abs(this.y - player.y);
        // Make enemy attack player if within 10 pixels
        if (XdistanceToPlayer < 15) {
            if (cursors.space.isDown) {
                this.health -= 10;
            }
            else if (XdistanceToPlayer < 15 &&
                YdistanceToPlayer < 30) {
                player.health -= 5;
                this.x -= 30;
            }
        }
    }
}

/**
 * Main game scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class Game extends Phaser$1.Scene {
    constructor() {
        super('Game');
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "background", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "healthText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scoreText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "helpText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "player", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "enemies", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "cursors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "finalScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    create() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 2048, 576);
        // Add background as a TileSprite for repeating background
        this.background = this.add.tileSprite(0, 0, 2048, 576, 'gameBG')
            .setOrigin(0, 0);
        this.background.setScrollFactor(0);
        // Set the world bounds so the player stays on ground
        this.physics.world.setBounds(0, 0, 1048, 450);
        // Create player and add to scene
        this.player = new Player({
            scene: this,
            x: 100,
            y: 450,
            texture: 'playerSprite'
        }, 100, 0);
        // Add player to the scene
        this.add.existing(this.player);
        // Set player's body properties
        const playerBody = this.player.body;
        playerBody.setAllowGravity(true);
        playerBody.setImmovable(false);
        // Make the camera follow the player
        this.camera.startFollow(this.player, true, 0.5, 0.5);
        // Initialize enemies group
        this.enemies = this.add.group();
        // Create cursors if input.keyboard is not null
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            // Enable physics for the player
            this.physics.add.existing(this.player);
            // Enable physics for the enemies
            if (this.enemies) {
                this.enemies.getChildren().forEach((enemy) => {
                    this.physics.add.existing(enemy);
                });
            }
        }
        // Create text for player's health
        this.healthText = this.add.text(850, 10, 'Health: ' + (this.player?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        // Create text for player's score
        this.scoreText = this.add.text(850, 30, 'Score: ' + (this.player?.score ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        this.helpText = this.add.text(10, 10, 'Use arrow keys to move (up to jump) and space to attack', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        // Create enemy and add to scene periodically
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (this.player) {
                    const enemyX = this.player.x - Phaser$1.Math.Between(200, 400);
                    const enemyY = 200;
                    const enemy = Enemy.addEnemy(this, enemyX, enemyY, 'enemySprite', 10);
                    // Add enemy to the group
                    if (this.enemies) {
                        this.enemies.add(enemy);
                    }
                }
            },
            loop: true
        });
        // Add 5 health to the player's health every 5 seconds
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (this.player && this.player.health < 100) {
                    this.player.health += 5;
                }
            },
            loop: true
        });
    }
    update() {
        if (this.player && this.cursors && this.enemies) {
            // Update player and enemies
            this.player.update();
            // Update all enemies
            this.enemies.getChildren().forEach((enemy) => {
                enemy.update(this.player, this.cursors);
            });
            // Update the background's tile position based on player's movement
            if (this.player.body) {
                this.background.tilePositionX += this.player.body.velocity.x
                    * this.game.loop.delta / 1000;
            }
            // Make sure the camera keeps the player centered
            this.camera.scrollX = this.player.x - this.camera.width / 2;
            this.camera.scrollY = this.player.y - this.camera.height / 2;
            // Handle player jump input
            const playerBody = this.player.body;
            if (this.cursors.up?.isDown && playerBody.touching.down) {
                playerBody.setVelocityY(-300);
            }
            // Update text displaying player's health and score
            this.healthText.setText('Health: ' + this.player.health);
            this.scoreText.setText('Score: ' + this.player.score);
            // Check if player health is 0, go to game over
            if (this.player.health == 0) {
                this.finalScore = this.player.score;
                this.scene.start('GameOver', { score: this.finalScore });
            }
        }
    }
}

/**
 * Game over scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class GameOver extends phaser_minExports.Scene {
    constructor() {
        super('GameOver');
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "background", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameoverText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scoreText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "highScoreText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    // gets score from game scene
    create(data) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0000ff);
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        this.gameoverText = this.add.text(512, 100, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        });
        this.gameoverText.setOrigin(0.5);
        this.scoreText = this.add.text(512, 200, 'Score: ' + data.score, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        });
        this.scoreText.setOrigin(0.5);
        // Assume highScore is stored globally
        let highScore = parseInt(localStorage.getItem('highScore') || '0', 10);
        if (data.score > highScore) {
            highScore = data.score;
            localStorage.setItem('highScore', highScore.toString());
        }
        this.highScoreText = this.add.text(512, 300, 'High Score: ' + highScore, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        });
        this.highScoreText.setOrigin(0.5);
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

/**
 * Main menu scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class MainMenu extends phaser_minExports.Scene {
    constructor() {
        super('MainMenu');
        Object.defineProperty(this, "background", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "logo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    create() {
        this.background = this.add.image(512, 384, 'background');
        this.logo = this.add.image(512, 300, 'logo');
        this.title = this.add.text(512, 460, 'Final Project', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}

/**
 * Preloader scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
class Preloader extends phaser_minExports.Scene {
    constructor() {
        super('Preloader');
    }
    init() {
        this.add.image(626, 352, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }
    preload() {
        //  Load the assets for the game
        this.load.setPath('assets');
        this.load.image('gameBG', 'backgroundBG.png');
        this.load.image('playerSprite', 'mainSprite.png');
        this.load.image('enemySprite', 'enemySprite.png');
        this.load.image('coinObject', 'coinObject.png');
        this.load.image('platformObject', 'platformObject.png');
        this.load.image('logo', 'logo.png');
    }
    create() {
        this.scene.start('MainMenu');
    }
}

/**
 * Main.
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 100 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ]
};
var main = new phaser_minExports.Game(config);

return main;

})();
//# sourceMappingURL=bundle.js.map