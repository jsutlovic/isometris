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
    this.inactive = [];
    this.baseVec = new THREE.Vector3(0, 1, 0);

    this.inactive.push(new Tetromino('S'));
    this.inactive.push(new Tetromino('L', { x: 1, y: 2, color: 0x228811 }));

    this.activePiece = null;
    this.activePiece = new Tetromino('I', { x: 0, y: 7, rotation: 0, color: 0x222288 });
    this.inactive.push(this.activePiece);
  };

  return GameModel;
});
