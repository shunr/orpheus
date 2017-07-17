const spawn = require('child_process').spawn;

const db = require('./db');
const conf = require('../config');
const featureMapping = require('../feature_mapping');

let mod = module.exports = {};

mod.trainModel = function(token, features, verdict, callback) {
  let py = spawn('python3', [
    'orpheus/ml_scripts/train.py',
    token,
    JSON.stringify(features),
    verdict,
    Object.keys(featureMapping).length
  ]);
  py.stdout.on('end', function() {
    callback();
  });
  py.stderr.on('data', function(data) {
    console.log(data.toString());
  });
  py.stdin.end();
};

mod.getTrainingResults = function(token, callback) {
  let py = spawn('python3', [
    'orpheus/ml_scripts/classify.py',
    0,
    token,
    Object.keys(featureMapping).length,
    db.loadGenres().length
  ]);
  py.stdout.on('data', function(data) {
    callback(JSON.parse(data.toString()));
  });
  py.stderr.on('data', function(data) {
    console.log(data.toString());
  });
  py.stdin.end();
};

mod.getPredictionFromFeatures = function(token, features, callback) {
  let py = spawn('python3', [
    'orpheus/ml_scripts/classify.py',
    1,
    token,
    JSON.stringify(features)
  ]);
  py.stdout.on('data', function(data) {
    console.log(data.toString());
    callback(parseFloat(data.toString()));
  });
  py.stderr.on('data', function(data) {
    console.log(data.toString());
  });
  py.stdin.end();
};