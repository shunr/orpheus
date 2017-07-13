const express = require('express');
const uuid = require('uuid/v4');
const db = require('../orpheus/db');
const router = express.Router();

/* GET home page. */
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

function _learningListener(socket, token) {
  socket.on('nextTrack', function(){
    console.log(db.getNextTrack(token));
  });
  
  socket.on('nextTrack', function(){
    console.log(db.getNextTrack(token));
  });
  
  socket.on('nextTrack', function(){
    console.log(db.getNextTrack(token));
  });
  
}

module.exports = function(io) {
  io.of('/learn').on('connection', function(socket) {

    socket.on('token', function(token) {
      let session = token;
      if (!db.isValidSessionToken(token)) {
        session = _sendNewToken(socket);
      }
      _learningListener(socket, session);
      socket.emit('ready');
    });
    
  });
  return router;
}