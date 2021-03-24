// collect stars, no enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
        // Put global variable here
        this.coin = 0;
    }

    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map2', 'assets/Level2.json');
        
        this.load.spritesheet('tiles', 'assets/TileMap1.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('tiles2', 'assets/TileMap2.png', {frameWidth: 64, frameHeight: 64});
    
        this.load.spritesheet('objects', 'assets/goldCoin.png', {frameWidth: 64, frameHeight: 64});
    
        this.load.atlas('player', 'assets/Bella.png', 'assets/Bella.json');
    
        this.load.image('coin2', 'assets/Coin.png');
        this.load.image('exit2', 'assets/Exit.png');
        this.load.image('pet2', 'assets/Pet.png');
    
    
        
    
    
    
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
    
    
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.backgroundLayer.width;
        this.physics.world.bounds.height = this.backgroundLayer.height;
       
    
        // Set starting and ending position using object names in tiles
        this.startPoint = map2.findObject("objectLayer", obj => obj.name === "startPoint");
        this.endPoint = map2.findObject("objectLayer", obj => obj.name === "endPoint");
    
    
        console.log('startPoint', this.startPoint.x, this.startPoint.y);
        console.log('endPoint', this.endPoint.x, this.endPoint.y);

        // Place an image manually on the endPoint
        this.add.image(this.endPoint.x, this.endPoint.y, 'exit2').setOrigin(0, 0);

    
       // create the player sprite
       this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player').setScale(1);
    
       this.player.setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.backgroundLayer);
    
    // Add random pet
     this.pet2 = this.physics.add.group({
        key: 'pet2',
        repeat: 5,
        setXY: { x: 400, y: 0, stepX: Phaser.Math.Between(300, 300) }
    });

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
    
    
        // the this.player will collide with this layer
        this.collideLayer.setCollisionByProperty({Collide:true})
        
    
    
        // this.playerwill collide with the level tiles 
        this.physics.add.collider(this.collideLayer, this.player);
        // this.physics.add.collider(this.coinLayer, this.player);
    
       
        this.cursors = this.input.keyboard.createCursorKeys();
    
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
    
    
      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0,map2.widthInPixels, map2.heightInPixels);
      // make the camera follow the this.player
      this.cameras.main.startFollow(this.player);
    
      // set background color, so the sky is not black    
      this.cameras.main.setBackgroundColor('#ccccff');
    
       //add text
       this.add.text(30,550, 'Level 2', { font: '30px Antonio', fill: 'white' }).setScrollFactor(0);
    
    }
    
    collectcoin(player,tiles) {
        this.coin++;
        console.log('Collect Coin', this.coin, tiles.x, tiles.y);
        this.coinLayer.removeTileAt(tiles.x, tiles.y);
        return false;
    }
    
    hitPet(player,pet) {
        //bombs.disableBody(true, true);
        console.log('Hit pet, restart game');
        this.cameras.main.shake(100);
        // delay 1 sec
        this.time.delayedCall(1000,function() {
    
            this.scene.restart();
    //        this.scene.start("gameoverScene");
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
    if ( this.player.x >= this.endPoint.x && this.player.y >= this.endPoint.y ) {
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level2");
        this.scene.start("level3");
    }

    
    }
    }