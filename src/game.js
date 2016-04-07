var platform,
    helicopter,
    cursors,
    rescued = 0,
    saved = 0,
    rescuedText,
    savedText;

var Game = {

    preload: function() {
        this.game.load.image('sky', '../assets/sky.png');
        this.game.load.image('helicopter', '../assets/helicopter.png');
        this.game.load.image('prisoner', '../assets/prisoner.png');
        this.game.load.image('enemy', '../assets/enemy.png');
        this.game.load.image('bullet', '../assets/bullet.gif');
        this.game.load.image('platform', '../assets/platform.png');
        this.game.load.image('cloud', '../assets/cloud.png');
    },

    create: function() {
        // World camera bounds
        this.game.world.setBounds(0, 0, this.game.world.width * 2, this.game.world.height);

        //  We're going to be using physics, so enable the Arcade Physics system
        //  I think that Arcade Physics are enabled by default but i'm not sure about it. ¯\_(ツ)_/¯
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Creating objects
        this._createLevel();
        this._createPrisoners();
        this._createEnemies();
        this._createHelicopter();

        // Enable key controls
        cursors = this.game.input.keyboard.createCursorKeys();

        rescuedText = this.game.add.text(16, 16, 'Rescued: 0', { fontSize: '32px', fill: '#000' });
        rescuedText.fixedToCamera = true;
    },

    update: function() {
        this.game.physics.arcade.collide(helicopter, platform);

        //  Checks if the helicopter overlaps with any of the prisoners, if he does call the rescuePrisoner function
        this.game.physics.arcade.overlap(helicopter, prisoners, this._rescuePrisoner, null, this);

        this._handleCursors();
    },

    _createLevel: function() {
        // adding a beautiful background and clouds
        sky = this.game.add.sprite(0, 0, 'sky');
        sky.scale.setTo(2, 1);

        this.game.add.sprite(0, 100, 'cloud');
        this.game.add.sprite(1000, 150, 'cloud');

        // adding platform and scale to look better
        platform = this.game.add.sprite(0, this.game.world.height - 64, 'platform');
        platform.scale.setTo(4, 2);

        // enabling phisics and setting body to fixed
        this.game.physics.arcade.enable(platform);

        platform.body.enable = true;
        platform.body.immovable = true;
    },

    _createPrisoners: function() {
        // adding a prisoners group with three guys
        prisoners = this.game.add.group();

        p1 = prisoners.create(this.game.world.width - 80, this.game.world.height - 105, 'prisoner');
        p2 = prisoners.create(this.game.world.width - 160, this.game.world.height - 105, 'prisoner');
        p3 = prisoners.create(this.game.world.width - 240, this.game.world.height - 105, 'prisoner');

        this.game.physics.arcade.enable(prisoners);
    },

    _createEnemies: function() {
        // adding enemies group with three bad guys
        enemies = this.game.add.group();

        e1 = enemies.create(880, this.game.world.height - 160, 'enemy');
        e2 = enemies.create(960, this.game.world.height - 160, 'enemy');
        e3 = enemies.create(1040, this.game.world.height - 160, 'enemy');
    },

    _createHelicopter: function() {
        // adding helicopter
        helicopter = this.game.add.sprite(100, this.game.world.height - 143, 'helicopter');

        // set camera to follow him
        this.game.camera.follow(helicopter);

        //  We need to enable physics to helicopter and the platform
        this.game.physics.arcade.enable(helicopter);

        //  Helicopter colliding on world bounds
        helicopter.body.collideWorldBounds = true;
    },

    _rescuePrisoner: function(helicopter, prisoner) {
        // a prisoner should be rescued before being taken to a safe place, right?
        // kill isn't a good name =P
        prisoner.kill();
        rescued += 1;
        rescuedText.text = 'Rescued: ' + rescued;
    },

    _handleCursors: function() {
        // reseting helicopter velocity and rotation properties
        helicopter.body.velocity.x = 0;
        helicopter.body.velocity.y = 0;
        helicopter.rotation = 0;

        if (cursors.left.isDown) {
            helicopter.body.velocity.x = -200;
            helicopter.rotation += -0.1;
        } else if (cursors.right.isDown) {
            helicopter.body.velocity.x = 200;
            helicopter.rotation += 0.1;
        }

        if (cursors.up.isDown) {
            helicopter.body.velocity.y = -200;
        } else if (cursors.down.isDown) {
            helicopter.body.velocity.y = 200;
        }
    },
};
