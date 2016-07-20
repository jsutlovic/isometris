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
    this.isometric = false;
    this.clearColor = 0x000000;
    this.pieceSpacing = new THREE.Vector3(1.1, 1.1, 1.1);
    this.blockGeom = new THREE.BoxGeometry(1, 1, 1);

    window.addEventListener("resize", this.resize.bind(this), false);

    var scene = new THREE.Scene();
    this.scene = scene;

    var aspect = this.getAspect();
    this.aspect = aspect;
    var zoom = 14;
    this.zoom = zoom;

    var camera = new THREE.OrthographicCamera();
    this.camera = camera;
    this.setCamera();

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(this.clearColor);
    this.renderer = renderer;
  };

  GameView.prototype.setCamera = function setCamera() {
    var camera = this.camera,
        aspect = this.aspect,
        zoom = this.zoom;

    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.bottom = -3.0;
    camera.top = (zoom * 2) + camera.bottom;
    camera.near = 1;
    camera.far = 1000;
    if (this.isometric === true) {
      camera.position.set(-zoom, zoom / 2, zoom);
    } else {
      camera.position.set(0, 0, zoom);
    }
    camera.lookAt(this.scene.position);
    camera.updateProjectionMatrix();
  };

  GameView.prototype.setupScene = function setupScene(scene, model) {
    var axes = new THREE.AxisHelper(this.zoom);
    // scene.add(axes);

    var bottomPlane = new THREE.Mesh(
      new THREE.BoxGeometry(12, 6, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x124555 })
    );
    bottomPlane.position.y = 0.44;
    bottomPlane.rotation.x = -0.5 * Math.PI;

    scene.add(bottomPlane);

    var unitMat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      transparent: true,
      opacity: 0.065,
    });
    var nextMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.1,
    });

    var x, y;
    for (y = 0; y < model.height; y++) {
      for (x = 0; x < model.width; x++) {
        var unitMesh = new THREE.Mesh(this.blockGeom, unitMat);

        var vec = model.baseVec.clone();
        vec.add(new THREE.Vector3(x, y));
        vec.multiply(this.pieceSpacing);
        unitMesh.position.copy(vec);

        scene.add(unitMesh);
      }
    }

    var nextBgOffset = new THREE.Vector3(-5, 10);
    for (y = 0; y < 3; y++) {
      for (x = 0; x < 4; x++) {
        var nextMesh = new THREE.Mesh(this.blockGeom, nextMat);

        var nextVec = model.baseVec.clone();
        nextVec.add(new THREE.Vector3(x, y));
        nextVec.add(nextBgOffset);
        nextVec.multiply(this.pieceSpacing);
        nextMesh.position.copy(nextVec);

        scene.add(nextMesh);
      }
    }

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
    this.setupScene(scene, model);

    model.inactivePieces.forEach(function(piece) {
      this.renderTetromino(piece, model);
    }, this);

    this.renderTetromino(model.activePiece, model);
    this.renderTetromino(model.nextPiece, model);

    this.render();
  };

  GameView.prototype.renderTetromino = function renderTetromino(tetromino, model) {
    var tmMaterial = new THREE.MeshLambertMaterial({color: tetromino.color});

    for (var i = 0; i < tetromino.blocks.length; i++) {
      var block = tetromino.blocks[i];

      var vec = model.baseVec.clone();
      vec.add(tetromino.vec);
      vec.add(block);
      vec.multiply(this.pieceSpacing);

      var cube = new THREE.Mesh(this.blockGeom, tmMaterial);
      cube.position.copy(vec);
      this.scene.add(cube);
    }
  };

  GameView.prototype.resize = function resize() {
    this.aspect = this.getAspect();
    this.setCamera();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  return GameView;
});
