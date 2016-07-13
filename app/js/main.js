/* global require,document */
'use strict'; // jshint globalstrict:true

require.config({
  urlArgs: new Date().getTime().toString(),
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    three: {
      exports: 'THREE'
    }
  },
  paths: {
    underscore: '../vendor/js/underscore',
    jquery: '../vendor/js/zepto',
    three: '../vendor/js/three',
  }
});

require(['three', 'jquery', 'game'], function(THREE, $, Game) {
  var game = new Game();
  $(document).ready(game.render.bind(game));
});
