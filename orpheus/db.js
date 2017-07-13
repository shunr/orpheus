'use strict'
const lowdb = require('lowdb');
const conf = require('../config');
const TRACKS_KEY = 'tracks';
const GENRES_KEY = 'genres';
const AUTH_KEY = 'authString';

let mod = module.exports = {};

let db = lowdb(conf.db.storagePath);

db.defaults({
  genres: [],
  tracks: {},
  numberOfTracks: 0
}).write();

mod.setGenres = function (object) {
  db.set(GENRES_KEY, object).write();
};

mod.setAuthString = function (string) {
  db.set(AUTH_KEY, string).write();
}

mod.loadGenres = function() {
  return db.get(GENRES_KEY).value();
}

mod.loadAuthString = function() {
  return db.get(AUTH_KEY).value();
}

mod.addTracks = function(tracks) {
  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    let existing = db.get([TRACKS_KEY, track.id]).value();
    if (existing) {
      db.get([TRACKS_KEY, track.id, 'genres']).push(track.genres[0]).write();
    } else {
      let numTracks = db.get('numberOfTracks').value();
      db.set(TRACKS_KEY + '.' + track.id, track).write();
      db.set('numberOfTracks', numTracks + 1).write();
      if (numTracks % 100 === 0) {
        console.log(numTracks);
      }
      
    }
  }
}

mod.clear = function() {
  db.set(GENRES_KEY, []).write();
  db.set(TRACKS_KEY, {}).write();
  db.set('numberOfTracks', 0).write();
};