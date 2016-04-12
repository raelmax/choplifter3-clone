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

        this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
        this.BULLET_SPEED = 500; // pixels/second
        this.NUMBER_OF_BULLETS = 20;

        // Creating objects
        this._createLevel();
        this._createPrisoners();
        this._createEnemies();
        this._createBullets();
        this._createHelicopter();

        // Enable key controls
        cursors = this.game.input.keyboard.createCursorKeys();

        // Creating a text object to show rescued value
        rescuedText = this.game.add.text(16, 16, 'Rescued: 0', { fontSize: '32px', fill: '#000' });
        rescuedText.fixedToCamera = true;
    },

    update: function() {
        this.game.physics.arcade.collide(helicopter, platform);

        // Checks if the helicopter overlaps with any of the prisoners, if he does call the rescuePrisoner function
        this.game.physics.arcade.overlap(helicopter, prisoners, this._rescuePrisoner, null, this);

        // Kill enemies
        this.game.physics.arcade.overlap(this.bulletPool, enemies, this._killEnemies, null, this);

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

        this.game.physics.arcade.enable(enemies);
    },

    _createBullets: function() {
        // Create an object pool of bullets
        this.bulletPool = this.game.add.group();

        for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
            // Create each bullet and add it to the group.
            var bullet = this.game.add.sprite(0, 0, 'bullet');
            this.bulletPool.add(bullet);

            // Set its pivot point to the center of the bullet
            bullet.anchor.setTo(0.5, 0.5);

            // Enable physics on the bullet
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

            // Set its initial state to "dead".
            bullet.kill();
        }
    },

    _createHelicopter: function() {
        // adding helicopter
        helicopter = this.game.add.sprite(100, this.game.world.height - 143, 'helicopter');

        // set camera to follow him
        this.game.camera.follow(helicopter);

        // We need to enable physics to helicopter and the platform
        this.game.physics.arcade.enable(helicopter);

        // Helicopter colliding on world bounds
        helicopter.body.collideWorldBounds = true;
    },

    _rescuePrisoner: function(helicopter, prisoner) {
        // a prisoner should be rescued before being taken to a safe place, right?
        // kill isn't a good name =P
        prisoner.kill();
        rescued += 1;
        rescuedText.text = 'Rescued: ' + rescued;
    },

    _killEnemies: function(bullet, enemy) {
        enemy.kill();
        bullet.kill();
    },

    _shootBullet: function() {
        // Enforce a short delay between shots by recording
        // the time that each bullet is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
        this.lastBulletShotAt = this.game.time.now;

        // Get a dead bullet from the pool
        var bullet = this.bulletPool.getFirstDead();

        // If there aren't any bullets available then don't shoot
        if (bullet === null || bullet === undefined) return;

        // Revive the bullet
        // This makes the bullet "alive"
        bullet.revive();

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;

        // Set the bullet position to the gun position.
        bullet.reset(helicopter.x + 50, helicopter.y + 50);

        // Shoot it
        bullet.body.velocity.x = this.BULLET_SPEED;
        bullet.body.velocity.y = 0;
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

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this._shootBullet();
        }
    },
};
