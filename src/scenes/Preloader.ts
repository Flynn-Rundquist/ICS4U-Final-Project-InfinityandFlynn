/**
 * Preloader scene
 *
 * By: Flynn Rundeuiqst & Infinity DeGuzman
 * Version: 1.0
 * Since: 15-05-2024
 */

import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(626, 352, 'background');

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {

            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game
        this.load.setPath('assets');

        this.load.image('gameBG', 'backgroundBG.png');
        this.load.image('playerSprite', 'mainSprite.png');
        this.load.image('enemySprite', 'enemySprite.png');
        this.load.image('coinObject', 'coinObject.png');
        this.load.image('platformObject', 'platformObject.png');
        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }

}
export default Preloader;
