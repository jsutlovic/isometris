/* global require */
define([
  'three',
  'models/game_piece',
], function(THREE, GamePiece) {
  'use strict';

  var GameModel = function GameModel() {
    this.inactivePieces = [];
    this.activePiece = null;
    this.baseVec = new THREE.Vector3(0, 1, 0);

    this.init();
  };

  GameModel.prototype.init = function init() {
    this.inactivePieces.push(new GamePiece());
    this.inactivePieces.push(new GamePiece({ x: 1, y: 2, color: 0x228811 }));
    this.inactivePieces.push(new GamePiece({ x: 0, y: 4, rotation: 1, color: 0x222288 }));
  };

  return GameModel;
});
