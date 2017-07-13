const express = require('express');
const uuid = require('uuid/v4');
const db = require('../orpheus/db');
const train = require('../orpheus/train');
const router = express.Router();

let ready = false;

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
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
  socket.on('track_good', function(){
    _trainModel(token, id, 1, function(){
      id = _sendNextTrack(socket, token);
    });
  });
  socket.on('track_bad', function(){
    _trainModel(token, id, -1, function(){
      id = _sendNextTrack(socket, token);
    });
  });
  socket.on('track_skip', function(){
    _sendNextTrack(socket, token);
  });
}

function _sendNextTrack(socket, token) {
  let id = db.getNextTrack(token);
  socket.emit('new_track', db.getTrackFromId(id));
  return id;
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
      _learningListener(socket, session);
    });
    
  });
  return router;
}

router.setReady = function () {
  ready = true;
}