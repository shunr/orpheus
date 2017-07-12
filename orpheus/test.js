var spawn = require('child_process').spawn,
    py    = spawn('python3', ['src/test.py']),
    data = [1,2,3,4];

py.stdout.on('data', function(data){
  console.log(data.toString());
});
py.stdout.on('end', function(){
  console.log("end");
});
py.stdin.write(JSON.stringify(data));
py.stdin.end();

