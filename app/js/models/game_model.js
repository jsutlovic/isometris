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
    this.inactiveBlocks = [];
    this.baseVec = new THREE.Vector3(-this.width / 2 + 0.5, 1, 0);
    this.tetrominoBag = Tetromino.getShuffledPieces();
    this.activePiece = this.start(this.nextType());
    this.nextPiece = this.upNext(this.tetrominoBag[0]);

    for (var y = 0; y < this.height; y++) {
      this.inactiveBlocks[y] = [];
    }
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

  GameModel.prototype.start = function start(type) {
    return new Tetromino(type, { x: this.width/2 - 1, y: this.startHeight });
  };

  GameModel.prototype.upNext = function upNext(type) {
    return new Tetromino(type, { x: -4, y: 10 });
  };

  GameModel.prototype.freezeBlocks = function freezeBlocks(piece) {
    return piece.blocks.map(function(block) {
      var frozen = block.clone();
      frozen.vec.add(piece.vec);
      return frozen;
    });
  };

  GameModel.prototype.checkRows = function checkRows() {
    var rowCounts = this.inactiveBlocks.map(function(row) {
      return row.reduce(function(prev, curr) {
        return prev + ((curr && 1) || 0);
      }, 0);
    });

    var fullRowIndexes = [];
    for (var y = 0, shifted = 0; y < this.height; y++) {
      var rowCount = rowCounts[y];
      if (rowCount === 0) break;
      for (var x = 0; x < this.width; x++) {
        var block = this.inactiveBlocks[shifted][x];
        if (block !== undefined) {
          block.vec.y = shifted;
        }
      }
      if (rowCount === 10) {
        this.inactiveBlocks.splice(shifted, 1);
        this.inactiveBlocks.push([]);
      } else {
        shifted++;
      }
    }
    console.log("Deleted " + (y-shifted) + " rows.");

    return rowCounts;
  };

  GameModel.prototype.freeze = function freeze(piece) {
    var frozen = this.freezeBlocks(piece);
    frozen.forEach(function(block) {
      this.inactiveBlocks[block.vec.y][block.vec.x] = block;
    }, this);
    console.log(this.checkRows());
  };

  GameModel.prototype.freezeActive = function freezeActive() {
    this.freeze(this.activePiece);
    this.activePiece = this.start(this.nextType());
    this.nextPiece = this.upNext(this.tetrominoBag[0]);
  };

  GameModel.prototype.nextType = function nextType() {
    var next = this.tetrominoBag.shift();
    if (this.tetrominoBag.length === 0) {
      this.tetrominoBag = Tetromino.getShuffledPieces();
    }
    return next;
  };

  GameModel.prototype.outOfBounds = function outOfBounds(blocks) {
    return blocks.reduce(function(prev, block) {
      var vec = block.vec;
      return prev || vec.x < 0 || vec.y < 0 || vec.x >= this.width;
    }.bind(this), false);
  };

  GameModel.prototype.collisions = function collisions(blocks) {
    return blocks.reduce(function(prev, block) {
      return prev || this.inactiveBlocks[block.vec.y][block.vec.x] !== undefined;
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
