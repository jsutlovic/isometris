/* global require */
define([
  'three',
  'underscore',
], function(THREE, _) {
  'use strict';

  var GamePiece = function GamePiece(options) {
    this.subPieces = [];

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

    this.vec = new THREE.Vector3(opts.x, opts.y, opts.z);
    this.color = opts.color;
    this.rotation = opts.rotation;

    this.subPieces.push(
      new THREE.Vector3(0, 0),
      new THREE.Vector3(0, 1),
      new THREE.Vector3(1, 0),
      new THREE.Vector3(-1, 0)
    );
  };

  GamePiece.prototype.freeze = function freeze() {
  };

  return GamePiece;
});

