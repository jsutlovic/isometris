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
    this.startHeight = 21;
    this.inactivePieces = [];
    this.inactiveBlocks = [];
    this.baseVec = new THREE.Vector3(-this.width / 2 + 0.5, 1, 0);
    this.tetrominoBag = Tetromino.getShuffledPieces();
    this.activePiece = this.startPiece(this.nextPiece());

    var inactive = [
      new Tetromino.S({ x: 3 }),
      new Tetromino.T({ x: 5 }),
      new Tetromino.J({ x: 2, y: 2, rotation: 1 }),
      new Tetromino.L({ x: 4, y: 2, color: 0x228811 }),
      new Tetromino.Z({ x: 7 }),
      new Tetromino.O({ x: 6, y: 2}),
      new Tetromino.S({ x: 8, y: 1, rotation: 1}),
      new Tetromino.I({ x: 1, y: 2, rotation: 3}),
    ];
    inactive.map(this.freeze.bind(this));
  };

  GameModel.prototype.startPiece = function startPiece(type) {
    return new Tetromino(type, { x: this.width/2 - 1, y: this.startHeight });
  };

  GameModel.prototype.freezeBlocks = function freezeBlocks(piece) {
    return piece.blocks.map(function(block) {
      var frozen = block.clone();
      frozen.add(piece.vec);
      return frozen;
    });
  };

  GameModel.prototype.freeze = function freeze(piece) {
    this.inactivePieces.push(piece);
    Array.prototype.push.apply(this.inactiveBlocks, this.freezeBlocks(piece));
  };

  GameModel.prototype.freezeActive = function freezeActive() {
    this.freeze(this.activePiece);
    this.activePiece = this.startPiece(this.nextPiece());
  };

  GameModel.prototype.nextPiece = function nextPiece() {
    var next = this.tetrominoBag.shift();
    if (this.tetrominoBag.length === 0) {
      this.tetrominoBag = Tetromino.getShuffledPieces();
    }
    return next;
  };

  GameModel.prototype.outOfBounds = function outOfBounds(blocks) {
    return blocks.reduce(function(prev, block) {
      return prev || block.x < 0 || block.y < 0 || block.x >= this.width;
    }.bind(this), false);
  };

  GameModel.prototype.collisions = function collisions(blocks) {
    return blocks.reduce(function(prev, block) {
      return prev || this.inactiveBlocks.reduce(function(p, inactive) {
        return p || inactive.equals(block);
      }, false);
    }.bind(this), false);
  };

  GameModel.prototype.validMove = function validMove(piece, callback) {
    var checkPiece = piece.clone();
    callback(checkPiece);

    var frozenBlocks = this.freezeBlocks(checkPiece);
    return !(this.outOfBounds(frozenBlocks) || this.collisions(frozenBlocks));
  };

  return GameModel;
});
