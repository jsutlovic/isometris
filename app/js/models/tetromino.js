/* global require */
define([
  'three',
  'underscore',
], function(THREE, _) {
  'use strict';

  var rotVec = new THREE.Vector3(0, 0, 1);

  var Tetromino = function Tetromino(options) {
    this.init(options);
  };

  Tetromino.prototype.init = function init(options) {
    var opts = _.defaults(options || {}, {
      x: 0,
      y: 0,
      z: 0,
      color: 0x881133,
      rotation: 0,
    });

    this.subPieces = [];
    this.vec = new THREE.Vector3(opts.x, opts.y, opts.z);
    this.color = opts.color;
    this.rotation = opts.rotation;

    this.rotationCenter = new THREE.Vector3();
    this.subPieces.push(
      new THREE.Vector3(-1, 1),
      new THREE.Vector3(0, 1),
      new THREE.Vector3(0, 0),
      new THREE.Vector3(1, 0)
    );

    // this.rotationCenter = new THREE.Vector3(-0.5, -0.5, 0);

    // this.subPieces.push(
    //   new THREE.Vector3(2, 0),
    //   new THREE.Vector3(1, 0),
    //   new THREE.Vector3(0, 0),
    //   new THREE.Vector3(-1, 0)
    // );

    this.rotate(this.rotation);
  };

  Tetromino.prototype.rotate = function rotate(direction) {
    this.rotation = (this.rotation + direction) & 3;

    for (var i = 0; i < this.subPieces.length; i++) {
      var subPiece = this.subPieces[i];
      var angle = - (Math.PI / 2) * direction;

      subPiece.add(this.rotationCenter);
      subPiece.applyAxisAngle(rotVec, angle);
      subPiece.sub(this.rotationCenter);
    }
  };

  return Tetromino;
});

