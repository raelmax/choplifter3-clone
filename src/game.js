window.onload = function() {
    var game = new Phaser.Game(
            800, 500, Phaser.AUTO, '', {preload: preload, create: create, update: update}
        ),
        platform,
        helicopter,
        cursors,
        rescued = 0,
        saved = 0,
        rescuedText,
        savedText;

    function preload () {
        game.load.image('sky', '../assets/sky.png');
        game.load.image('helicopter', '../assets/helicopter.png');
        game.load.image('prisoner', '../assets/prisoner.png');
        game.load.image('platform', '../assets/platform.png');
        game.load.image('cloud', '../assets/cloud.png');
    }

    function create () {
        // World camera bounds
        game.world.setBounds(0, 0, game.world.width * 3, game.world.height);

        //  We're going to be using physics, so enable the Arcade Physics system
        //  I think that Arcade Physics are enabled by default but i'm not sure about it. ¯\_(ツ)_/¯
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // adding a beautiful background and clouds
        sky = game.add.sprite(0, 0, 'sky');
        sky.scale.setTo(3, 1);

        game.add.sprite(0, 100, 'cloud');
        game.add.sprite(1000, 150, 'cloud');

        // adding platform and scale to look better
        platform = game.add.sprite(0, game.world.height - 64, 'platform');
        platform.scale.setTo(6, 2);

        // adding a prisoners group with three guys
        prisoners = game.add.group();

        p1 = prisoners.create(game.world.width - 80, game.world.height - 105, 'prisoner');
        p2 = prisoners.create(game.world.width - 160, game.world.height - 105, 'prisoner');
        p3 = prisoners.create(game.world.width - 240, game.world.height - 105, 'prisoner');

        // adding helicopter
        helicopter = game.add.sprite(100, game.world.height - 143, 'helicopter');
        game.camera.follow(helicopter);

        //  We need to enable physics to helicopter and the platform
        game.physics.arcade.enable([helicopter, platform, prisoners]);

        platform.body.enable = true;
        platform.body.immovable = true;

        //  Helicopter collidiing on world bounds
        helicopter.body.collideWorldBounds = true;

        // Enable key controls
        cursors = game.input.keyboard.createCursorKeys();

        rescuedText = game.add.text(16, 16, 'Rescued: 0', { fontSize: '32px', fill: '#000' });
        rescuedText.fixedToCamera = true;
    }

    function update () {
        game.physics.arcade.collide(helicopter, platform);

        //  Checks if the helicopter overlaps with any of the prisoners, if he does call the rescuePrisoner function
        game.physics.arcade.overlap(helicopter, prisoners, rescuePrisoner, null, this);

        // reseting helicopter velocity and rotation properties
        helicopter.body.velocity.x = 0;
        helicopter.body.velocity.y = 0;
        helicopter.rotation = 0;

        if (cursors.left.isDown) {
            helicopter.body.velocity.x = -200;
            helicopter.rotation += -0.1;
        }
        else if (cursors.right.isDown) {
            helicopter.body.velocity.x = 200;
            helicopter.rotation += 0.1;
        }

        if (cursors.up.isDown) {
            helicopter.body.velocity.y = -200;
        }
        else if (cursors.down.isDown) {
            helicopter.body.velocity.y = 200;
        }

        if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            helicopter.body.velocity.y = -200;
        }
    }

    function rescuePrisoner (helicopter, prisoner) {
        // a prisoner should be rescued before being taken to a safe place, right?
        // kill isn't a good name =P
        prisoner.kill();
        rescued += 1;
        rescuedText.text = 'Rescued: ' + rescued;
    }

    function helicopterShot () {
        
    }
};
