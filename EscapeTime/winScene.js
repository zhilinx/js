class winScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'winScene' });
    }

    preload() {
        this.load.image('win','assets/winScene.png');
        this.load.audio('win','assets/win.mp3');

    }

    create () {

        this.add.image(0, 0, 'win').setOrigin(0, 0);
        
        // this.add.text(0,580, 'Press Spacebar to continue', { font: '24px Courier', fill: '#000000' });

        console.log("This is winScene");

        this.bgmusicSnd = this.sound.add('win');
    
        this.bgmusicSnd = this.sound.add('win', {volume: 0.5});
        this.bgmusicSnd.play();

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        var aDown = this.input.keyboard.addKey('A');

        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, reply game");
        this.bgmusicSnd.stop();
        this.scene.stop("winScene");
        this.scene.start("mainScene");
        }, this );

        aDown.on('down', function(){
            console.log("A pressed (main menu)");
            this.scene.stop("winScene");
            this.scene.start("mainScene");
            }, this );

    }

}
