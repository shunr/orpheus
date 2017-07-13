'use strict'
const lowdb = require('lowdb');

const conf = require('../config');

let mod = module.exports = {};

let db = lowdb(conf.db.storagePath);

db.defaults({
  genres: [],
  tracks: {},
  sessions: {}
}).write();

function _getShuffledTracks(maxTracks) {
  let keys = Object.keys(db.get('tracks').value());
  let shuffled = [];
  let n = 0;
  while (keys.length && n <= maxTracks) {
    let i = Math.floor(Math.random() * keys.length);
    let element = keys.splice(i, 1);
    shuffled.push(element[0]);
    n++;
  }
  return shuffled;
}

mod.setGenres = function(object) {
  db.set('genres', object).write();
};

mod.setAuthString = function(string) {
  db.set('authString', string).write();
}

mod.loadGenres = function() {
  return db.get('genres').value();
}

mod.loadAuthString = function() {
  return db.get('authString').value();
}

mod.getTrackFromId = function(id) {
  return db.get(['tracks', id]).value();
}

mod.getNextTrack = function(token) {
  let last = db.get(['sessions', token, 'queuedTracks']).head().value();
  db.get(['sessions', token, 'queuedTracks']).pullAt(0).write();
  return last;
}

mod.createSession = function(token) {
  db.set(['sessions', token], {
    token: token,
    queuedTracks: _getShuffledTracks(conf.tracks.maxQueuedTracks),
    currentTrack: 0
  }).write();
}

mod.removeSession = function(token) {
  db.unset(['sessions', token]).write();
}

mod.addTracks = function(tracks) {
  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    let existing = db.get(['tracks', track.id]).value();
    if (existing) {
      db.get(['tracks', track.id, 'genres']).push(track.genres[0]).write();
    } else {
      db.set(['tracks', track.id], track).write();
    }
  }
}

mod.clear = function() {
  db.set('genres', []).write();
  db.set('tracks', {}).write();
  db.set('numberOfTracks', 0).write();
};

mod.clearSessions = function() {
  db.set('sessions', {}).write();
};

mod.isValidSessionToken = function(token) {
  if (!token) return false;
  return db.get(['sessions', token]).value();
}