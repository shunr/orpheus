var socket = io('http://162.243.171.232:3000/learn');

socket.on('connect', function(){
  socket.emit('token', localStorage.getItem('sessionToken'));
});

socket.on('new_token', function(data){
  localStorage.setItem('sessionToken', data);
});

socket.on('disconnect', function(){});

socket.emit('nextTrack');