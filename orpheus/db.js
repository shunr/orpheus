'use strict'
const fs = require('fs');
const rimraf = require('rimraf');
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
  let keys = db.get('tracks').keys().value();
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
  let genres = [];
  for (let i = 0; i < object.length; i++) {
    if (conf.tracks.ignoredGenres.indexOf(object[i]) == -1) {
      genres.push(object[i]);
    }
  }
  db.set('genres', genres).write();
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
    genreRatings: {}
  }).write();
}

mod.getTrainedSongs = function(token) {
  let queued = db.get(['sessions', token, 'queuedTracks']).size().value();
  let maxQueued = Math.min(db.get('tracks').keys().value().length, conf.tracks.maxQueuedTracks);
  return maxQueued - queued;
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
  let dir = conf.db.modelDirectory;
  db.set('sessions', {}).write();
  rimraf(dir, function() {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};

mod.isValidSessionToken = function(token) {
  if (!token) return false;
  return db.get(['sessions', token]).value();
}