'use strict'
const conf = require('../config');
const db = require('./db');
const spotify = require('./spotify');
const parser = require('./parser');

let mod = module.exports = {};
let setupDb = false;

mod.start = function(callback) {
  db.clearSessions();
  if (setupDb) {
    mod.auth(callback, setupDb);
  } else {
    callback();
  }
};

mod.auth = function(callback) {
  spotify.refreshAccessToken(function(authString) {
    if (authString) {
      db.setAuthString(authString);
      _setupDb(callback);
    }
  });
}

function _setupDb(callback) {
  db.clear();
  let authString = db.loadAuthString();
  _setupGenres(function() {
    _setupTracks(callback);
  });
}

function _setupGenres(callback) {
  let authString = db.loadAuthString();
  spotify.getGenres(authString, function(genres) {
    db.setGenres(genres);
    callback();
  });
}

function _setupTracks(callback) {
  let authString = db.loadAuthString();
  let genres = db.loadGenres();
  _iterateGenres(authString, genres, 0, callback);
}

function _iterateGenres(authString, genres, i, callback) {
  console.log(genres[i], i, genres.length);
  if (i < genres.length) {
    spotify.getRecommendations(authString, genres[i], conf.tracks.trackspPerGenre, function(tracks) {
      spotify.getFeatures(authString, parser.getTrackIds(tracks), function(features) {
        let formatted = parser.formatTracks(tracks, features, genres[i], i);
        db.addTracks(formatted);
        _iterateGenres(authString, genres, i + 1, callback);
      });
    });
  } else {
    callback();
  }
}