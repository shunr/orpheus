var socket = io('http://162.243.171.232:3000/learn');

function get() {
  
  localStorage.setItem("sessionToken", "");
}

socket.on('connect', function(){
  console.log('woo');
});

socket.on('news', function(data){
  console.log(data);
});
socket.on('disconnect', function(){});