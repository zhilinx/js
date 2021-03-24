// collect stars, no enemies
class level3 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level3' });
        // Put global variable here
        this.coin = 0
    }

preload() {

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/Level3.json');
    
    this.load.spritesheet('tiles', 'assets/TileMap1.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('tiles2', 'assets/TileMap2.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('objects', 'assets/goldCoin.png', {frameWidth: 64, frameHeight: 64});

    this.load.atlas('player', 'assets/Bella.png', 'assets/Bella.json');

    this.load.image('coin2', 'assets/Coin.png');


    



}

create() {

    var map = this.make.tilemap({key: 'map'});
    var Tiles1 = map.addTilesetImage('TileMap1', 'tiles1');
    var Tiles2 = map.addTilesetImage('TileMap2', 'tiles2');
    var Coin = map.addTilesetImage('Coin', 'coin2');


    // create the ground layer
    this.backgroundLayer = map.createDynamicLayer('backgroundLayer', Tiles1, 0, 0);
    this.backgroundLayer = map.createDynamicLayer('backgroundLayer', Tiles2, 0, 0)
    this.collideLayer = map.createDynamicLayer('collideLayer', Tiles1, 0, 0);
    this.collideLayer = map.createDynamicLayer('collideLayer', Tiles2, 0, 0);
    this.coinLayer = map.createDynamicLayer('coinLayer', Coin, 0, 0);


    this.backgroundLayer.setCollisionByProperty({block: true});
   
    
    console.log( this.collideLayer.width, this.collideLayer.height );



    // set the boundaries of our game world
    this.physics.world.bounds.width = this.backgroundLayer.width;
    this.physics.world.bounds.height = this.backgroundLayer.height;
   

    // Set starting and ending position using object names in tiles
    this.startPoint = map.findObject("objectLayer", obj => obj.name === "startPoint");
    this.endPoint = map.findObject("objectLayer", obj => obj.name === "endPoint");

    // Place an image manually on the endPoint
    // this.add.image(this.endPoint.x, this.endPoint.y, 'coin').setOrigin(0, 0);

    console.log('startPoint ', this.startPoint.x, this.startPoint.y);
    console.log('endPoint ', this.endPoint.x, this.endPoint.y);

   // create the player sprite
   this.player = this.physics.add.sprite(this.startPoint.x, this.startPoint.y, 'player').setScale(1);

   this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.backgroundLayer);

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
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);


    // set the boundaries of our game world
    this.physics.world.bounds.width = this.collideLayer.width;
    this.physics.world.bounds.height = this.collideLayer.height;

    //   collect coin 
    this.coinLayer.setTileIndexCallback(25, this.collectcoin, this);
    this.physics.add.collider(this.coinLayer, this.player);
    // this.physics.add.overlap(this.coinLayer, this.player,this.collectcoin,this);
    // this.physics.add.overlap(this.player, this.coinLayer,this.collectcoin, null, this );


  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0,map.widthInPixels, map.heightInPixels);
  // make the camera follow the this.player
  this.cameras.main.startFollow(this.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');


}

collectcoin(player,tiles) {
    this.coin++;
    console.log('Collect Coin', this.coin, tiles.x, tiles.y);
    this.coinLayer.removeTileAt(tiles.x, tiles.y);
    return false;
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


}
}