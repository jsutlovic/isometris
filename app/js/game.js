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
  };

  Game.prototype.render = function render() {
    this.view.renderInto(document.getElementById('game'));
    this.view.render();
    this.view.renderModel(this.model);
  };

  return Game;
});
