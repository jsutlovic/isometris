/* global require */
define([
  'three',
  'views/game_view',
  'models/game_model',
], function(THREE, GameView, GameModel) {
  'use strict';

  var Game = function Game() {
    this.init();
  };

  Game.prototype.init = function init() {
    this.view = new GameView();
    this.model = new GameModel();
    this.animating = true;
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
