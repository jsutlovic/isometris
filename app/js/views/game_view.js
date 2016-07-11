/* global require */
define([
  'three',
], function(THREE) {
  'use strict';

  var GameView = function GameView() {
    this.dom_rendered = false;
  };

  GameView.prototype.init = function init() {
    var scene = new THREE.Scene();
    this.scene = scene;

    var aspect = window.innerWidth / window.innerHeight;
    var d = 12;

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // var camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(-d, d / 2, d);
    camera.lookAt(scene.position);
    this.camera = camera;

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc8c8c8);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = renderer;

    var axes = new THREE.AxisHelper(d);
    scene.add(axes);

    var bottomPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ color: 0x124555 })
    );
    bottomPlane.rotation.x = -0.5 * Math.PI;

    scene.add(bottomPlane);

    var ambient = new THREE.AmbientLight("#ffffff");
    scene.add(ambient);
  };

  GameView.prototype.render_into = function render_into(el) {
    if (this.dom_rendered) return;
    el.appendChild(this.renderer.domElement);
    this.dom_rendered = true;
  };

  GameView.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera);
  };

  return GameView;
});
