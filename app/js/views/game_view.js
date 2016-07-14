/* global require */
define([
  'three',
], function(THREE) {
  'use strict';

  var GameView = function GameView() {
    this.init();
  };

  GameView.prototype.init = function init() {
    this.domRendered = false;
    this.pieceSpacing = new THREE.Vector3(1.2, 1.1, 1.2);

    window.addEventListener("resize", this.resize.bind(this), false);

    var scene = new THREE.Scene();
    this.scene = scene;

    var aspect = this.getAspect();
    this.aspect = aspect;
    var zoom = 12;
    this.zoom = zoom;

    // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var camera = new THREE.OrthographicCamera();
    this.camera = camera;
    this.setCamera(camera, aspect, zoom);
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xc8c8c8);
    this.renderer = renderer;

    this.setupScene(scene);
  };

  GameView.prototype.setCamera = function setCamera(camera, aspect, zoom) {
    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.bottom = -6;
    camera.top = (zoom * 2) + camera.bottom;
    camera.near = 1;
    camera.far = 1000;
    camera.position.set(-zoom, zoom / 2, zoom);
    camera.updateProjectionMatrix();
  };

  GameView.prototype.setupScene = function setupScene(scene) {
    var axes = new THREE.AxisHelper(this.zoom);
    scene.add(axes);

    var bottomPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ color: 0x124555 })
    );
    bottomPlane.rotation.x = -0.5 * Math.PI;

    scene.add(bottomPlane);

    var ambient = new THREE.AmbientLight("#ffffff", 0.8);
    scene.add(ambient);

    var spotlight = new THREE.SpotLight("#ffffff", 2);
    spotlight.position.set(0, 100, 30);
    spotlight.castShadow = true;
    scene.add(spotlight);
  };

  GameView.prototype.clearScene = function clearScene(scene) {
    scene.remove.apply(scene, scene.children);
    this.render();
  };

  GameView.prototype.getAspect = function getAspect() {
    return window.innerWidth / window.innerHeight;
  };

  GameView.prototype.renderInto = function renderInto(el) {
    if (this.domRendered) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(this.renderer.domElement);
    this.domRendered = true;
  };

  GameView.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera);
  };

  GameView.prototype.renderModel = function renderModel(model) {
    var scene = this.scene;
    this.clearScene(scene);
    this.setupScene(scene);

    for (var i=0; i < model.inactivePieces.length; i++) {
      var piece = model.inactivePieces[i];
      var pieceMaterial = new THREE.MeshLambertMaterial({color: piece.color});

      for (var j = 0; j < piece.subPieces.length; j++) {
        var subPiece = piece.subPieces[j];

        var vec = model.baseVec.clone();
        vec.add(piece.vec);
        vec.add(subPiece);
        vec.multiply(this.pieceSpacing);

        var cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          pieceMaterial
        );
        cube.position.copy(vec);
        scene.add(cube);
      }
    }

    this.render();
  };

  GameView.prototype.resize = function resize() {
    this.aspect = this.getAspect();
    this.setCamera(this.camera, this.aspect, this.zoom);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  return GameView;
});
