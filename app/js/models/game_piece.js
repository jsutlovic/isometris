/* global require */
define([
  'three',
  'underscore',
], function(THREE, _) {
  'use strict';

  var rotVec = new THREE.Vector3(0, 0, 1);

  var GamePiece = function GamePiece(options) {
    this.init(options);
  };

  GamePiece.prototype.init = function init(options) {
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

    this.subPieces.push(
      new THREE.Vector3(0, 0),
      new THREE.Vector3(0, 1),
      new THREE.Vector3(1, 0),
      new THREE.Vector3(-1, 0)
    );

    this.rotate(this.rotation);
  };

  GamePiece.prototype.rotate = function rotate(direction) {
    for (var i = 0; i < this.subPieces.length; i++) {
      var subPiece = this.subPieces[i];
      var angle = - (Math.PI / 2) * direction;
      subPiece.applyAxisAngle(rotVec, angle);
    }
  };

  return GamePiece;
});

