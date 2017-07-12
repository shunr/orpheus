'use strict'
const conf = require('../config');
const db = require('./db');
const spotify = require('./spotify');

let mod = module.exports = {};

mod.start = function() {
  spotify.refreshAccessToken(function (authString) {
    if (authString) {
      db.setAuthString(authString);
      spotify.getGenres(authString, db.setGenres);
      console.log(spotify.getRecommendations(authString, 'anime', 10, console.log));
    }
  });
};