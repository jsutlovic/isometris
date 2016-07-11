/* global require */
define([
  'three',
  'views/game_view',
], function(THREE, GameView) {
  'use strict';

  var Game = function Game() {
    this.view = new GameView();
  };

  Game.prototype.init = function init() {
    this.view.init();
    this.view.renderInto(document.getElementById('game'));
    this.render();
    return;
  };

  Game.prototype.render = function render() {
    this.view.render();
  };

  return Game;
});
