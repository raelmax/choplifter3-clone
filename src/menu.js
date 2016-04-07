var Menu = {
    preload: function() {
        // screen scale properties
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        // loading our images
        this.game.load.image('start_button', './assets/start_button.png');
    },

    create: function() {
        // calculate the center of screen to position our button
        var posX = (this.game.width / 2) - 100, // 100 = button width / 2
            posY = (this.game.height / 2) - 50; // 50 = button height / 2

        this.add.button(posX, posY, 'start_button', this.startGame, this);
    },

    startGame: function() {
        // Starting main game
        this.state.start('Game');
    }
};
