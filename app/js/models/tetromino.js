/* global require */
define([
  'three',
  'underscore',
], function(THREE, _) {
  'use strict';

  var rotVec = new THREE.Vector3(0, 0, 1);

  var tetromino_data = {
    "I": {
      color: 0x228888,
      center: new THREE.Vector3(-0.5, 0.5),
      blocks: [
        new THREE.Vector3(-1, 0),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
        new THREE.Vector3(2, 0),
      ],
    },
    "O": {
      color: 0x888822,
      center: new THREE.Vector3(-0.5, -0.5),
      blocks: [
        new THREE.Vector3(0, 1),
        new THREE.Vector3(1, 1),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
      ],
    },
    "T": {
      color: 0x882288,
      center: new THREE.Vector3(),
      blocks: [
        new THREE.Vector3(0, 1),
        new THREE.Vector3(-1, 0),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
      ],
    },
    "S": {
      color: 0x228822,
      center: new THREE.Vector3(),
      blocks: [
        new THREE.Vector3(0, 1),
        new THREE.Vector3(-1, 0),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 1),
      ],
    },
    "Z": {
      color: 0x882222,
      center: new THREE.Vector3(),
      blocks: [
        new THREE.Vector3(0, 1),
        new THREE.Vector3(-1, 1),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
      ],
    },
    "J": {
      color: 0x222288,
      center: new THREE.Vector3(),
      blocks: [
        new THREE.Vector3(-1, 1),
        new THREE.Vector3(-1, 0),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
      ],
    },
    "L": {
      color: 0x884422,
      center: new THREE.Vector3(),
      blocks: [
        new THREE.Vector3(1, 1),
        new THREE.Vector3(-1, 0),
        new THREE.Vector3(0, 0),
        new THREE.Vector3(1, 0),
      ],
    }
  };
  var tetrominos = Object.keys(tetromino_data);

  var Tetromino = function Tetromino(type, options) {
    this.init(type, options);
  };

  // Shorthand for Tetromino.<type>
  Object.keys(tetromino_data).forEach(function(key) {
    Tetromino[key] = _.partial(Tetromino, key);
  });

  Tetromino.getShuffledPieces = function getShuffledPieces() {
    var pieces = tetrominos.slice();
    var shuffled = [];
    for (var i = pieces.length; i > 0; i--) {
      var index = (Math.random() * i) | 0;
      Array.prototype.push.apply(shuffled, pieces.splice(index, 1));
    }
    console.log("Shuffled: " + shuffled);
    return shuffled;
  };

  Tetromino.prototype.init = function init(type, options) {
    if (type === null || type === undefined) {
      console.log("Error intializing Tetromino, no type given!");
      return;
    }

    var opts = _.defaults(options || {}, {
      x: 0,
      y: 0,
      z: 0,
      color: 0x881133,
      rotation: 0,
    });

    this.type = type;
    this.blocks = [];
    this.vec = new THREE.Vector3(opts.x, opts.y, opts.z);
    this.color = opts.color;
    this.rotation = opts.rotation;

    this.color = tetromino_data[type].color;
    this.rotationCenter = tetromino_data[type].center.clone();
    tetromino_data[type].blocks.forEach(function(block) {
      this.blocks.push(new Tetromino.Block(block.clone(), this.color));
    }.bind(this));

    this.rotate(this.rotation);
  };

  Tetromino.prototype.rotate = function rotate(direction) {
    this.rotation = (this.rotation + direction) & 3;

    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      var angle = - (Math.PI / 2) * direction;

      block.vec.add(this.rotationCenter);
      block.vec.applyAxisAngle(rotVec, angle);
      block.vec.sub(this.rotationCenter);
      block.vec.round();
    }
  };

  Tetromino.prototype.clone = function clone() {
    var newT = new Tetromino(this.type);

    newT.vec = this.vec.clone();
    newT.color = this.color;
    newT.rotation = this.rotation;
    newT.rotationCenter = this.rotationCenter.clone();

    newT.blocks = [];
    this.blocks.forEach(function(block) {
      newT.blocks.push(block.clone());
    });

    return newT;
  };

  Tetromino.Block = function Block(vec, color) {
    this.init(vec, color);
  };

  Tetromino.Block.prototype.init = function init(vec, color) {
    this.vec = vec;
    this.color = color;
  };

  Tetromino.Block.prototype.clone = function clone() {
    return new Tetromino.Block(this.vec.clone(), this.color);
  };

  return Tetromino;
});
