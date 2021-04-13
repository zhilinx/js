// collect stars, no enemies
class level3 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level3' });
        // Put global variable here
        this.coin = 0;
        this.coinCount = 0;
    }

    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map3', 'assets/Level3.json');
        
        this.load.spritesheet('tiles', 'assets/TileMap1.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('tiles2', 'assets/TileMap2.png', {frameWidth: 64, frameHeight: 64});
    
        this.load.spritesheet('objects', 'assets/goldCoin.png', {frameWidth: 64, frameHeight: 64});
    
        this.load.atlas('player', 'assets/Bella.png', 'assets/Bella.json');
    
        this.load.image('coin2', 'assets/Coin.png');
        this.load.image('exit2', 'assets/Exit.png');
        this.load.image('pet2', 'assets/Pet.png');
        this.load.image('boss', 'assets/no.png');

        this.load.audio('collect','assets/collectmoney.mp3');
        this.load.audio('bgmusic','assets/bgm.mp3');
        this.load.audio('hit','assets/explosion.mp3');
     
    
    
    }
    
    create() {
    
        var map3 = this.make.tilemap({key: 'map3'});
        var Tiles = map3.addTilesetImage('TileMap1', 'tiles');
        var Tiles2 = map3.addTilesetImage('TileMap2', 'tiles2');
        var Coin = map3.addTilesetImage('Coin', 'coin2');
    
    
        // create the ground layer
        this.backgroundLayer = map3.createDynamicLayer('backgroundLayer', Tiles2, 0, 0);
        this.collideLayer = map3.createDynamicLayer('collideLayer', Tiles2, 0, 0);
        this.coinLayer = map3.createDynamicLayer('coinLayer', Coin, 0, 0);
    
    
        this.backgroundLayer.setCollisionByProperty({block: true});
       
        
        console.log( this.collideLayer.width, this.collideLayer.height );
    
        this.collectSnd = this.sound.add('collect');
        this.hitSnd = this.sound.add('hit');
        this.bgmusicSnd = this.sound.add('bgmusic', {volume: 0.1});
        

        window.music1=this.bgmusicSnd;
        window.music1.play();
        window.music1.loop=true;
    
    
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.backgroundLayer.width;
        this.physics.world.bounds.height = this.backgroundLayer.height;
       
    
        // Set starting and ending position using object names in tiles
        this.startPoint = map3.findObject("Object Layer 1", obj => obj.name === "startPoint");
        this.endPoint = map3.findObject("Object Layer 1", obj => obj.name === "endPoint");

        var boss1 = map3.findObject("Object Layer 1", obj => obj.name === "Boss1");
        var boss2 = map3.findObject("Object Layer 1", obj => obj.name === "Boss2");
        var boss3 = map3.findObject("Object Layer 1", obj => obj.name === "Boss3");

        
        var pet1 = map3.findObject("Object Layer 1", obj => obj.name === "Pet1");
        var pet2 = map3.findObject("Object Layer 1", obj => obj.name === "Pet2");
        var pet3 = map3.findObject("Object Layer 1", obj => obj.name === "Pet3");
        var pet4 = map3.findObject("Object Layer 1", obj => obj.name === "Pet4");
    
    
        console.log('startPoint', this.startPoint.x, this.startPoint.y);
        console.log('endPoint', this.endPoint.x, this.endPoint.y);

        // Place an image manually on the endPoint
        this.add.image(this.endPoint.x, this.endPoint.y, 'exit2').setOrigin(0, 0);

    
       // create the player sprite
       this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player').setScale(1);
    
       this.player.setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.backgroundLayer);
    

    this.timedEvent1 = this.time.addEvent({ delay: 2000, callback: this.moveBoss1, callbackScope: this, loop: false });
    this.timedEvent3 = this.time.addEvent({ delay: 2000, callback: this.moveBoss3, callbackScope: this, loop: false });
    this.timedEvent2 = this.time.addEvent({ delay: 2000, callback: this.moveBoss2, callbackScope: this, loop: false });
    // this.timedEvent2 = this.time.addEvent({ delay: 4000, callback: this.moveRight, callbackScope: this, loop: true });
       

    // Collide platform with pet
    this.physics.add.collider(this.collideLayer, this.pet2);
    this.physics.add.collider(this.backgroundLayer, this.pet2);

    this.physics.add.collider(this.player, this.pet2, this.hitPet, null, this );




       // small fix to our player images, we resize the physics body object slightly
       this.player.body.setSize(this.player.width/2, this.player.height/2);  
    
       // player walk animation
       this.anims.create({
        key:'Front',
        frames:[
        {key: 'player', frame: 'Front1'},
        {key: 'player', frame: 'Front2'},
        {key: 'player', frame: 'Front3'},
        ],
        frameRate:6,
        repeat: -1
        });
    
        this.anims.create({
            key:'Back',
            frames:[
            {key: 'player', frame: 'Back1'},
            {key: 'player', frame: 'Back2'},
            {key: 'player', frame: 'Back3'},
            ],
            frameRate:6,
            repeat: -1
            });
    
        this.anims.create({
                key:'Right',
                frames:[
                {key: 'player', frame: 'Right1'},
                {key: 'player', frame: 'Right2'},
                {key: 'player', frame: 'Right3'},
                ],
                frameRate:6,
                repeat: -1
                });
    
    this.boss1 = this.physics.add.sprite(boss1.x, boss1.y, 'boss');
    this.boss2 = this.physics.add.sprite(boss2.x, boss2.y, 'boss');
    this.boss3 = this.physics.add.sprite(boss3.x, boss3.y, 'boss');

    this.pet1 = this.physics.add.sprite(pet1.x, pet1.y, 'pet2');
    this.pet2 = this.physics.add.sprite(pet2.x, pet2.y, 'pet2');
    this.pet3 = this.physics.add.sprite(pet3.x, pet3.y, 'pet2');
    this.pet4 = this.physics.add.sprite(pet4.x, pet4.y, 'pet2');
  


        // the this.player will collide with this layer
        this.collideLayer.setCollisionByProperty({Collide:true})
        
    
    
        // this.playerwill collide with the level tiles 
        this.physics.add.collider(this.collideLayer, this.player);
        // this.physics.add.collider(this.coinLayer, this.player);
    
       
        this.cursors = this.input.keyboard.createCursorKeys();

        // this text will show the score
    this.coinText = this.add.text(700, 50, this.coinCount, {
        fontSize: '30px',
        fill: '#FFFFFF'
        });

         // fix the text to the camera
    this.coinText.setScrollFactor(0);
    this.coinText.visible = true;
    
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
    
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.collideLayer.width;
        this.physics.world.bounds.height = this.collideLayer.height;
    
        //   collect coin 
        this.coinLayer.setTileIndexCallback(49, this.collectcoin, this);
        this.physics.add.collider(this.coinLayer, this.player);
        // this.physics.add.overlap(this.coinLayer, this.player,this.collectcoin,this);
        // this.physics.add.overlap(this.player, this.coinLayer,this.collectcoin, null, this );

    this.physics.add.overlap(this.player, this.pet1, this.hitPet, null, this );
    this.physics.add.overlap(this.player, this.pet2, this.hitPet, null, this );
    this.physics.add.overlap(this.player, this.pet3, this.hitPet, null, this );
    this.physics.add.overlap(this.player, this.pet4, this.hitPet, null, this );
    this.physics.add.overlap(this.player, this.boss1, this.hitNo, null, this );
    this.physics.add.overlap(this.player, this.boss2, this.hitNo, null, this );
    this.physics.add.overlap(this.player, this.boss3, this.hitNo, null, this );

    
    
      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0,map3.widthInPixels, map3.heightInPixels);
      // make the camera follow the this.player
      this.cameras.main.startFollow(this.player);
    
      // set background color, so the sky is not black    
      this.cameras.main.setBackgroundColor('#ccccff');
    
       //add text
       this.add.text(30,550, 'Level 3 - 6 Coins (Do not hit the boss & pets!)', { font: '30px Antonio', fill: 'white' }).setScrollFactor(0);
    
    }
    
    collectcoin(player,tiles) {
        this.coin++;
    console.log('Collect Coin', this.coin, tiles.x, tiles.y);
    this.coinLayer.removeTileAt(tiles.x, tiles.y);
    this.coinCount += 1; 
    this.collectSnd.play();

    // console.log(this.coinCount);
    this.coinText.setText(this.coinCount);
    return false;
    }
    
    hitPet(player,pet) {
        //bombs.disableBody(true, true);
        console.log('Hit pet, restart game');
        this.hitSnd.play();
           window.music1.stop();

        this.cameras.main.shake(100);
        // delay 1 sec
        this.time.delayedCall(1000,function() {
    
            // this.scene.restart();
           this.scene.start("gameoverScene");
        

        },[], this);
    }
    
    
hitNo(player,no) {
    //bombs.disableBody(true, true);
    console.log('Hit no, restart game');
    this.hitSnd.play();
           window.music1.stop();

    this.cameras.main.shake(100);
    // delay 1 sec
    this.time.delayedCall(1000,function() {

        this.scene.restart();
    //    this.scene.start("gameoverScene");
    

    },[], this);
}

moveBoss1() {
    var pos2=this.boss1.x
    console.log(pos2)
    this.tweens.timeline({
        targets: this.boss1,
        ease: 'Linear',
        loop: -1, // loop forever
        duration: 3000,
        tweens: [
        {
            x: pos2+400,
        },
        {
            x: pos2,
        },
    ]
    });
}

moveBoss3() {
    console.log('moveDownUp')
    var pos1=this.boss3.y
    this.tweens.timeline({
        targets: this.boss3,
        ease: 'Linear',
        loop: -1, // loop forever
        duration: 3000,
        tweens: [
        {
            y: pos1+200,
        },
        {
            y: pos1,
        },
    ]
    });
}
 
moveBoss2() {
    console.log('moveDownUp')
    var pos1=this.boss2.y
    this.tweens.timeline({
        targets: this.boss2,
        ease: 'Linear',
        loop: -1, // loop forever
        duration: 5000,
        tweens: [
        {
            y: pos1+300,
        },
        {
            y: pos1,
        },
    ]
    });
}

    
    update(time, delta) {
    
        if ( this.cursors.left.isDown) {
            this.player.body.setVelocityX(-200);
            this.player.anims.play('Right', true); // walk left
            this.player.flipX = false; // flip the sprite to the left
            //console.log('left');
        } else if ( this.cursors.right.isDown)

        {
            this.player.body.setVelocityX(200);
            this.player.anims.play('Right', true);
            this.player.flipX = true; // use the original sprite looking to the right
            //console.log('right');
        } else if ( this.cursors.up.isDown )
        {
            this.player.body.setVelocityY(-200);  
            this.player.anims.play('Back', true);
            //console.log('up');  
        } else if ( this.cursors.down.isDown )
        {
            this.player.body.setVelocityY(200);  
            this.player.anims.play('Front', true);  
            //console.log('down');
        } else {
            this.player.anims.stop();
            this.player.body.setVelocity(0,0); 
            //console.log('idle');
        }

    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y && this.coin > 5 ) {
        console.log('Reached endPoint, loading next level');
        window.music1.stop();
        this.scene.stop("level3");
        this.scene.start("winScene");
    }

    
    }
    }