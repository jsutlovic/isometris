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
    this.running = true;
    this.level = 0;
    this.tick = false;
    this.events = [];
    this.timeouts = {};

    var validateMove = function validateMove(callback) {
      return function() {
        if (this.model.activePiece === undefined) return false;
        var movable = this.model.validMove(this.model.activePiece, callback);
        if (!movable) return false;
        callback.apply(this, [this.model.activePiece]);
        return true;
      };
    };
    this.eventHandlers = {
      left: validateMove(function(p) { p.vec.x -= 1; }),
      right: validateMove(function(p) { p.vec.x += 1; }),
      down: validateMove(function(p) { p.vec.y -= 1; }),
      gravity: validateMove(function(p) { p.vec.y -= 1; }),
      cw: validateMove(function(p) { p.rotate(1); }),
      ccw: validateMove(function(p) { p.rotate(-1); }),
    };

    Mousetrap.bind("escape", function() {
      console.log("running: " + this.running);
      this.running = !this.running;
    }.bind(this));

    Mousetrap.bind(["q", "z"], function() {
      console.log("rotate ccw");
      this.events.push("ccw");
    }.bind(this));

    Mousetrap.bind(["e", "x"], function() {
      console.log("rotate cw");
      this.events.push("cw");
    }.bind(this));

    Mousetrap.bind(["up", "w"], function() {
      return false;
    }.bind(this));

    Mousetrap.bind(["down", "s"], function() {
      console.log("down");
      this.events.push("down");
      return false;
    }.bind(this));

    Mousetrap.bind(["left", "a"], function() {
      console.log("left");
      this.events.push("left");
    }.bind(this));

    Mousetrap.bind(["right", "d"], function() {
      console.log("right");
      this.events.push("right");
    }.bind(this));

    Mousetrap.bind(["i"], function() {
      this.view.isometric = !this.view.isometric;
      console.log("isometric: " + this.view.isometric);
      this.view.setCamera();
    }.bind(this));

    this.update();
    this.doTick();
  };

  Game.prototype.render = function render() {
    this.view.renderInto(document.getElementById('game'));
    this.view.renderModel(this.model);
  };

  Game.prototype.handleEvents = function handleEvents() {
    var events = this.events.splice(0, this.events.length);

    var modelDraw = events.map(function(event) {
      return this.eventHandlers[event];
    }, this).reduceRight(function(prev, handler) {
      var current = false;
      if (handler !== undefined) {
        current = handler.apply(this);
      }
      return prev || current;
    }.bind(this), false);

    return modelDraw;
  };

  Game.prototype.doTick = function doTick() {
    this.tick = true;
    var newTick = 512 >> this.level;
    this.timeouts.doTick = window.setTimeout(doTick.bind(this), newTick);
  };

  Game.prototype.update = function update() {
    this.timeouts.update = window.setTimeout(update.bind(this), 1000 / 30);
    if (!this.running) return;

    if (this.tick) {
      this.tick = false;

      if (!this.eventHandlers.down.apply(this)) {
        if (this.model.activePiece.vec.y == this.model.startHeight) {
          // Lose condition
          console.log("Lose condition detected!");

          // STOP ALL TIMEOUTS
          window.clearTimeout(this.timeouts.doTick);
          window.clearTimeout(this.timeouts.update);
        } else {
          this.model.freezeActive();
        }
      }
      this.view.renderModel(this.model);
    }
    if (this.handleEvents() === true) this.view.renderModel(this.model);

    window.requestAnimationFrame(this.view.render.bind(this.view));
  };

  return Game;
});
