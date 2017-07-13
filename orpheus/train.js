const spawn = require('child_process').spawn;

const db = require('./db');
const conf = require('../config');

let mod = module.exports = {};

mod.trainModel = function(token, features, verdict, callback) {
  let py = spawn('python3', ['orpheus/ml_scripts/test.py']);

  py.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  py.stdout.on('end', function() {
    console.log("end");
  });

  py.stdin.write(JSON.stringify(features));
  py.stdin.end();
};