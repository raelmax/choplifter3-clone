window.onload = function() {
    var game = new Phaser.Game(
            800, 500, Phaser.AUTO, '', {preload: preload, create: create, update: update}
        ),
        platform,
        helicopter,
        cursors,
        rescued = 0,
        saved = 0;

    function preload () {
        game.load.image('sky', '../assets/sky.png');
        game.load.image('helicopter', '../assets/helicopter.png');
        game.load.image('prisoner', '../assets/prisoner.png');
        game.load.image('platform', '../assets/platform.png');
    }

    function create () {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // adding a background
        game.add.sprite(0, 0, 'sky');

        // adding platform
        platform = game.add.sprite(0, game.world.height - 64, 'platform');
        platform.scale.setTo(2, 2);

        // adding prisoners
        prisoner1 = game.add.sprite(80, game.world.height - 105, 'prisoner');
        prisoner2 = game.add.sprite(160, game.world.height - 105, 'prisoner');
        prisoner3 = game.add.sprite(240, game.world.height - 105, 'prisoner');

        // adding helicopter
        helicopter = game.add.sprite(game.world.width / 2, game.world.height - 143, 'helicopter');

        //  We need to enable physics to helicopter and the platform
        game.physics.arcade.enable([helicopter, platform]);

        platform.body.enable = true;
        platform.body.immovable = true;

        //  Helicopter physics properties.
        helicopter.body.collideWorldBounds = true;

        // Enable key controls
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update () {
        game.physics.arcade.collide(helicopter, platform);

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
    }
};
