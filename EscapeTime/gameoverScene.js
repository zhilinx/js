class gameoverScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'gameoverScene' });
    }

    preload() {
        this.load.image('gameover','assets/gameoverScene.png');
        this.load.audio('lose','assets/lose.wav');
    

    }

    create () {

        this.add.image(0, 0, 'gameover').setOrigin(0, 0);
        
        // this.add.text(0,580, 'Press Spacebar to continue', { font: '24px Courier', fill: '#000000' });

        console.log("This is gameoverScene");

        this.bgmusicSnd2 = this.sound.add('lose', {volume: 0.5});
        
        
        window.music1=this.bgmusicSnd2;
        window.music1.play();
        window.music1.loop=false;
    



        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        var aDown = this.input.keyboard.addKey('A');

        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, reply game");
        window.music1.stop();
        this.scene.stop("gameoverScene");
        this.scene.start("mainScene");
        }, this );

        // aDown.on('down', function(){
        //     console.log("A pressed (main menu)");
        //     this.scene.stop("gameoverScene");
        //     this.scene.start("mainScene");
        //     window.music1.stop();
        //     }, this );

    }

}
