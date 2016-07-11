/* global require */
define([
  'three',
], function(THREE) {
  'use strict';

  var GameView = function GameView() {
    this.dom_rendered = false;

    window.addEventListener("resize", this.resize.bind(this), false);
  };

  GameView.prototype.init = function init() {
    var scene = new THREE.Scene();
    this.scene = scene;

    var aspect = this.get_aspect();
    this.aspect = aspect;
    var zoom = 12;
    this.zoom = zoom;

    // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var camera = new THREE.OrthographicCamera();
    this.camera = camera;
    this.set_camera(camera, aspect, zoom);
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc8c8c8);
    this.renderer = renderer;

    var axes = new THREE.AxisHelper(zoom);
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

  GameView.prototype.set_camera = function set_camera(camera, aspect, zoom) {
    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.top = zoom;
    camera.bottom = -zoom;
    camera.near = 1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    camera.position.set(-zoom, zoom / 2, zoom);
  };

  GameView.prototype.get_aspect = function get_aspect() {
    return window.innerWidth / window.innerHeight;
  };

  GameView.prototype.render_into = function render_into(el) {
    if (this.dom_rendered) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(this.renderer.domElement);
    this.dom_rendered = true;
  };

  GameView.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera);
  };

  GameView.prototype.resize = function resize() {
    this.aspect = this.get_aspect();
    this.set_camera(this.camera, this.aspect, this.zoom);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  return GameView;
});
