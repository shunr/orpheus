var socket = io('http://162.243.171.232:3000/learn');

socket.on('connect', function(){
  socket.emit('token', localStorage.getItem('sessionToken'));
});

socket.on('disconnect', function(){
  socket.disconnect();
});

socket.on('new_token', function(data){
  localStorage.setItem('sessionToken', data);
});

socket.on('new_track', function(data){
  playTrack(data.preview_url);
});

socket.on('ready', function(data){
  nextTrack();
});

function nextTrack() {
  socket.emit('track_skip');
}

function rateGood() {
  socket.emit('track_good');
}

function rateBad() {
  socket.emit('track_bad');
}
