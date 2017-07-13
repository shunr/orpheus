'use strict'
const request = require('request');

const conf = require('../config');

const CLIENT_ID = conf.spotify.clientId;
const CLIENT_SECRET = conf.spotify.clientSecret;

let mod = module.exports = {};

mod.refreshAccessToken = function(callback) {
  let authString = 'Basic ' + new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Authorization': authString
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let object = JSON.parse(body);
      callback(object.token_type + ' ' + object.access_token);
    } else {
      callback(null);
    }
  });
};

mod.getGenres = function(authString, callback) {
  request.get({
    url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    headers: {
      'Authorization': authString
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let object = JSON.parse(body);
      callback(object.genres);
    } else {
      console.log(response.statusCode);
    }
  });
}

mod.getRecommendations = function(authString, seedGenre, limit, callback) {
  let params = {
    seed_genres: seedGenre,
    min_popularity: conf.tracks.minPopularity,
    limit: limit
  };
  request.get({
    url: 'https://api.spotify.com/v1/recommendations',
    headers: {
      'Authorization': authString
    },
    qs: params
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let object = JSON.parse(body);
      callback(object.tracks);
    } else {
      // Log error
    }
  });
}

mod.getFeatures = function(authString, ids, callback) {
  let params = {
    ids: ids.join()
  };
  request.get({
    url: 'https://api.spotify.com/v1/audio-features',
    headers: {
      'Authorization': authString
    },
    qs: params
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let object = JSON.parse(body);
      callback(object.audio_features);
    } else if (response.statusCode == 429) {
      setTimeout(function() {
        mod.getFeatures(authString, ids, callback);
      }, parseInt(response.headers['retry-after']) * 1000);
    }
  });
}