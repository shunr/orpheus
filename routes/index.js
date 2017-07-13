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
  socket.emit('new_token', uuid());
}

module.exports = function(io) {
  io.of('/learn').on('connection', function(socket) {

    socket.emit('news', {
      id: socket.id
    });

    socket.on('token', function(token) {
      if (!db.isValidSessionToken(token)) {
        _sendNewToken(socket);
      }
    });
    
  });
  return router;
}