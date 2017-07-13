const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = function(io) {
  io.of('/learn').on('connection', function(socket) {

    socket.emit('news', {
      id: socket.id
    });

    socket.on('event', console.log);
  });
  return router;
}