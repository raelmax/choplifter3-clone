var CHOPLIFTER3 = new Phaser.Game(800, 500, Phaser.AUTO, '');

// adding our game states
CHOPLIFTER3.state.add('Menu', Menu);
CHOPLIFTER3.state.add('Game', Game);

// menu is our entry point
CHOPLIFTER3.state.start('Menu');
