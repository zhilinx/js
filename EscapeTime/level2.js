// collect stars, no enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
        // Put global variable here
        this.coin = 0;
        this.coinCount = 0;
    }

    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map2', 'assets/Level2.json');
        
        this.load.spritesheet('tiles', 'assets/TileMap1.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('tiles2', 'assets/TileMap2.png', {frameWidth: 64, frameHeight: 64});
    
    
        this.load.atlas('player', 'assets/Bella.png', 'assets/Bella.json');
    
        this.load.image('coin2', 'assets/Coin.png');
        this.load.image('exit2', 'assets/Exit.png');
        this.load.image('pet2', 'assets/Pet.png');

        this.load.audio('collect','assets/collectmoney.mp3');
        this.load.audio('bgmusic','assets/bgm.mp3');
        this.load.audio('hit','assets/explosion.mp3');
    
    }
    
    create() {
    
        var map2 = this.make.tilemap({key: 'map2'});
        var Tiles = map2.addTilesetImage('TileMap1', 'tiles');
        var Tiles2 = map2.addTilesetImage('TileMap2', 'tiles2');
        var Coin = map2.addTilesetImage('Coin', 'coin2');
    
    
        // create the ground layer
        this.backgroundLayer = map2.createDynamicLayer('backgroundLayer', Tiles, 0, 0);
        this.collideLayer = map2.createDynamicLayer('collideLayer', Tiles2, 0, 0);
        this.coinLayer = map2.createDynamicLayer('coinLayer', Coin, 0, 0);
    
    
        this.backgroundLayer.setCollisionByProperty({block: true});
       
        
        console.log( this.collideLayer.width, this.collideLayer.height );
    
        this.collectSnd = this.sound.add('collect');
        this.hitSnd = this.sound.add('hit',{volume: 0.1});
        this.bgmusicSnd = this.sound.add('bgmusic', {volume: 0.1});
        

        window.music1=this.bgmusicSnd;
        window.music1.play();
        window.music1.loop=true;
    
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.backgroundLayer.width;
        this.physics.world.bounds.height = this.backgroundLayer.height;
       
    
        // Set starting and ending position using object names in tiles
        this.startPoint2 = map2.findObject("objectLayer", obj => obj.name === "startPoint2");
        this.endPoint = map2.findObject("objectLayer", obj => obj.name === "endPoint");

        var pet1 = map2.findObject("objectLayer", obj => obj.name === "Pet1");
        var pet2 = map2.findObject("objectLayer", obj => obj.name === "Pet2");
        var pet3 = map2.findObject("objectLayer", obj => obj.name === "Pet3");
        var pet4 = map2.findObject("objectLayer", obj => obj.name === "Pet4");
        var pet5 = map2.findObject("objectLayer", obj => obj.name === "Pet5");
        var pet6 = map2.findObject("objectLayer", obj => obj.name === "Pet6");
    
    
        console.log('startPoint2', this.startPoint2.x, this.startPoint2.y);
        console.log('endPoint', this.endPoint.x, this.endPoint.y);

        // Place an image manually on the endPoint
        this.add.image(this.endPoint.x, this.endPoint.y, 'exit2').setOrigin(0, 0);

    
       // create the player sprite
       this.player = this.physics.add.sprite(this.startPoint2.x, this.startPoint2.y, 'player').setScale(1);
    
       this.player.setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.backgroundLayer);
    
    
    this.timedEvent = this.time.addEvent({ delay: 2000, callback: this.moveLeft, callbackScope: this, loop: true });
    this.timedEvent2 = this.time.addEvent({ delay: 4000, callback: this.moveRight, callbackScope: this, loop: true });
       

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
    
    
    this.pet1 = this.physics.add.sprite(pet1.x, pet1.y, 'pet2');
    this.pet2 = this.physics.add.sprite(pet2.x, pet2.y, 'pet2');
    this.pet3 = this.physics.add.sprite(pet3.x, pet3.y, 'pet2');
    this.pet4 = this.physics.add.sprite(pet4.x, pet4.y, 'pet2');
    this.pet5 = this.physics.add.sprite(pet5.x, pet5.y, 'pet2');
    this.pet6 = this.physics.add.sprite(pet6.x, pet6.y, 'pet2');

        // the this.player will collide with this layer
        this.collideLayer.setCollisionByProperty({Collide:true})
        
    
    
        // this.playerwill collide with the level tiles 
        this.physics.add.collider(this.collideLayer, this.player);
        // this.physics.add.collider(this.coinLayer, this.player);
    
       
        this.cursors = this.input.keyboard.createCursorKeys();

        // this text will show the score
    this.coinText = this.add.text(700, 50, this.coinCount, {
        fontSize: '30px',
        fill: '#221C48'
        });

         // fix the text to the camera
    this.coinText.setScrollFactor(0);
    this.coinText.visible = true;
    
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
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
        this.physics.add.overlap(this.player, this.pet5, this.hitPet, null, this );
        this.physics.add.overlap(this.player, this.pet6, this.hitPet, null, this );

       
    
    
      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0,map2.widthInPixels, map2.heightInPixels);
      // make the camera follow the this.player
      this.cameras.main.startFollow(this.player);
    
      // set background color, so the sky is not black    
      this.cameras.main.setBackgroundColor('#ccccff');
    
       //add text
       this.add.text(30,550, 'Level 2 - 6 Coins (Do no hit the pets!)', { font: '30px Antonio', fill: 'white' }).setScrollFactor(0);
    
    }
    
    collectcoin(player,tiles) {
        this.coin++;
        console.log('Collect Coin', this.coin, tiles.x, tiles.y);
        this.coinLayer.removeTileAt(tiles.x, tiles.y);
        this.coinCount += 1; 
        this.collectSnd.play();
        this.coinText.setText(this.coinCount);
        return false;
    
    }
    
    hitPet(player,pet) {
        //bombs.disableBody(true, true);
        console.log('Hit pet, restart game');
        this.hitSnd.play();
        window.music1.stop();  
        

        this.cameras.main.shake(50);
        // delay 1 sec
        this.time.delayedCall(100,function() {
        
    
        //    this.scene.restart();
           this.scene.start("gameoverScene");
           
        },[], this);
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
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y) {
        console.log('Reached endPoint, loading next level');
        window.music1.stop();
        this.scene.stop("level2");
        this.scene.start("level3");
    }

    
    }
    }