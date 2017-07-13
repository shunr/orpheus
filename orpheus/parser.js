'use strict'
const conf = require('../config');
const db = require('./db');
const featureMapping = conf.featureMapping;

let mod = module.exports = {};

mod.formatTracks = function(tracks, featureSets, genre, genreIndex) {
  let parsed = [];
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].preview_url) {
      parsed.push({
        id: tracks[i].id,
        name: tracks[i].name,
        preview_url: tracks[i].preview_url,
        genres: [genre],
        features: _formatFeatureSet(featureSets[i], genreIndex)
      });
    }
  }
  return parsed;
}

mod.getTrackIds = function(tracks) {
  let ids = [];
  for (let i = 0; i < tracks.length; i++) {
    ids.push(tracks[i].id);
  }
  return ids;
}

function _formatFeatureSet(features, genreIndex) {
  let formatted = [];
  for (let i in features) {
    if (featureMapping[i]) {
      let min = featureMapping[i].min;
      let max = featureMapping[i].max;
      formatted.push([featureMapping[i].key, _normalize(min, max, features[i])]);
    }
  }
  formatted.push([Object.keys(featureMapping).length + genreIndex, 1]);
  return formatted;
}

function _normalize(min, max, val) {
  let norm = Math.min(Math.max(val, min), max);
  return (((norm - min) / (max - min)) * 2) - 1;
}