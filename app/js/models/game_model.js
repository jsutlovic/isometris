/* global require */
define([
  'three',
  'models/tetromino',
], function(THREE, Tetromino) {
  'use strict';

  var GameModel = function GameModel() {
    this.init();
  };

  GameModel.prototype.init = function init() {
    this.width = 10;
    this.height = 25;
    this.inactive = [];
    this.baseVec = new THREE.Vector3(-this.width / 2 + 0.5, 1, 0);

    this.inactive.push(
      new Tetromino.S({ x: 3 }),
      new Tetromino.T({ x: 5 }),
      new Tetromino.J({ x: 2, y: 2, rotation: 1 }),
      new Tetromino.L({ x: 4, y: 2, color: 0x228811 }),
      new Tetromino.Z({ x: 7 }),
      new Tetromino.O({ x: 6, y: 2}),
      new Tetromino.S({ x: 8, y: 1, rotation: 1}),
      new Tetromino.O({ x: 0, y: 0 })
    );

    this.activePiece = new Tetromino.I({ x: 0, y: 21, color: 0x222288 });
    this.inactive.push(this.activePiece);
  };

  return GameModel;
});
