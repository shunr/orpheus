const express = require('express');
const uuid = require('uuid/v4');
const db = require('../orpheus/db');
const train = require('../orpheus/train');
const conf = require('../config');
const featureMapping = require('../feature_mapping');
const router = express.Router();

let ready = false;

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Orpheus - Quantify your music taste',
    featureMapping: featureMapping,
    genres: db.loadGenres()
  });
});

function _sendNewToken(socket) {
  let token = uuid();
  socket.emit('new_token', token);
  db.createSession(token);
  return token;
}

function _trainModel(token, trackId, verdict, callback) {
  train.trainModel(token, db.getTrackFromId(trackId).features, verdict, callback);
}

function _learningListener(socket, token) {
  let id = _sendNextTrack(socket, token);
  socket.on('track_good', function() {
    _trainModel(token, id, 1, function() {
      id = _sendNextTrack(socket, token);
    });
  });
  socket.on('track_bad', function() {
    _trainModel(token, id, -1, function() {
      id = _sendNextTrack(socket, token);
    });
  });
  socket.on('track_skip', function() {
    _sendNextTrack(socket, token);
  });
}

function _sendNextTrack(socket, token) {
  let id = db.getNextTrack(token);
  let track = db.getTrackFromId(id);
  socket.emit('new_track', track);
  _sendTrainingResults(socket, token);
  _sendTrackPrediction(socket, token, track.features);
  return id;
}

function _sendTrainingResults(socket, token) {
  train.getTrainingResults(token, function(data){
    data.trainedSongs = db.getTrainedSongs(token);
    socket.emit('model_updated', data);
  });
}

function _sendTrackPrediction(socket, token, features) {
  train.getPredictionFromFeatures(token, features, function(data){
    socket.emit('new_prediction', data);
  });
}

module.exports = function(io) {
  io.of('/learn').on('connection', function(socket) {
    if (!ready) {
      socket.disconnect();
      return;
    }
    socket.on('token', function(token) {
      let session = token;
      if (!db.isValidSessionToken(token)) {
        session = _sendNewToken(socket);
      }
      socket.emit('ready');
      socket.on('ready', function(token) {
        _learningListener(socket, session);
      })
    });

  });
  return router;
}

router.setReady = function() {
  ready = true;
}