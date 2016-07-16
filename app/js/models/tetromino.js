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
      center: new THREE.Vector3(-0.5, -0.5),
      blocks: [
        new THREE.Vector3(-1, 1),
        new THREE.Vector3(0, 1),
        new THREE.Vector3(1, 1),
        new THREE.Vector3(2, 1),
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

  Object.keys(tetromino_data).forEach(function(key) {
    Tetromino[key] = _.partial(Tetromino, key);
  });

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

    this.blocks = [];
    this.vec = new THREE.Vector3(opts.x, opts.y, opts.z);
    this.color = opts.color;
    this.rotation = opts.rotation;

    this.color = tetromino_data[type].color;
    this.rotationCenter = tetromino_data[type].center.clone();
    tetromino_data[type].blocks.forEach(function(block) {
      this.blocks.push(block.clone());
    }.bind(this));

    this.rotate(this.rotation);
  };

  Tetromino.prototype.rotate = function rotate(direction) {
    this.rotation = (this.rotation + direction) & 3;

    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      var angle = - (Math.PI / 2) * direction;

      block.add(this.rotationCenter);
      block.applyAxisAngle(rotVec, angle);
      block.sub(this.rotationCenter);
    }
  };

  return Tetromino;
});

