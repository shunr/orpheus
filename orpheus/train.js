const spawn = require('child_process').spawn;

const db = require('./db');
const conf = require('../config');
const featureMapping = require('../feature_mapping');

let mod = module.exports = {};

mod.trainModel = function(token, features, verdict, callback) {
  let py = spawn('python3', ['orpheus/ml_scripts/train.py', token, JSON.stringify(features), verdict]);
  py.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  py.stdout.on('end', function() {
    callback();
  });
  py.stdin.end();
};

mod.getTrainingResults = function(token, callback) {
  let py = spawn('python3', [
    'orpheus/ml_scripts/classify.py',
    token,
    Object.keys(featureMapping).length,
    db.loadGenres().length
  ]);
  py.stdout.on('data', function(data) {
    callback(JSON.parse(data.toString()));
  });
  py.stdin.end();
};