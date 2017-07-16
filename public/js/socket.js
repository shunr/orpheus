var socket = io('http://162.243.171.232/learn');

socket.on('connect', function() {
  socket.emit('token', localStorage.getItem('sessionToken'));
});

socket.on('disconnect', function() {
  socket.disconnect();
});

socket.on('new_token', function(data) {
  localStorage.setItem('sessionToken', data);
});

socket.on('ready', function(data) {
  nextTrack();
  socket.on('new_track', function(data) {
    console.log(data);
    playTrack(data.preview_url);
    $('.track-header span').text(data.name);
    $('.track-header').fadeIn();
  });
  socket.on('model_updated', function(data) {
    console.log(data);
    stats.updateModel(data);
  });
});

function nextTrack() {
  socket.emit('track_skip');
  cooldown();
}

function rateGood() {
  socket.emit('track_good');
  cooldown();
}

function rateBad() {
  socket.emit('track_bad');
  cooldown();
}

function start() {
  var audio = document.getElementById("audio");
  audio.play();
  socket.emit('ready');
  $('.modal').modal('hide');
}