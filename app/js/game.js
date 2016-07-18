/* global require */
define([
  'three',
  'mousetrap',
  'views/game_view',
  'models/game_model',
], function(THREE, Mousetrap, GameView, GameModel) {
  'use strict';

  var Game = function Game() {
    this.init();
  };

  Game.prototype.init = function init() {
    this.view = new GameView();
    this.model = new GameModel();
    this.animating = true;

    Mousetrap.bind("escape", function() {
      console.log("stopped animating");
      this.animating = false;
    }.bind(this));

    Mousetrap.bind(["q", "z"], function() {
      console.log("rotate left");
      this.model.activePiece.rotate(-1);
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["e", "x"], function() {
      console.log("rotate right");
      this.model.activePiece.rotate(1);
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["down", "s"], function() {
      console.log("down");
      this.model.activePiece.vec.y -= 1;
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["up", "w"], function() {
      console.log("up");
      this.model.activePiece.vec.y += 1;
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["left", "a"], function() {
      console.log("left");
      this.model.activePiece.vec.x -= 1;
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["right", "d"], function() {
      console.log("right");
      this.model.activePiece.vec.x += 1;
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["i"], function() {
      this.view.isometric = !this.view.isometric;
      console.log("isometric: " + this.view.isometric);
      this.view.setCamera();
      this.view.renderModel(this.model);
    }.bind(this));

    Mousetrap.bind(["space"], function() {
      this.model.freezeActive();
      this.view.renderModel(this.model);
    }.bind(this));
  };

  Game.prototype.render = function render() {
    var view = this.view;
    var self = this;
    (function animate() {
      window.setTimeout(function() {
        if (!self.animating) return;

        window.requestAnimationFrame(animate);
        view.render();
      }, 1000 / 2);
    })();

    this.view.renderInto(document.getElementById('game'));
    this.view.renderModel(this.model);
  };

  return Game;
});
