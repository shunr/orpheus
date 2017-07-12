'use strict'
const lowdb = require('lowdb');
const conf = require('../config');

let mod = module.exports = {};

let db = lowdb(conf.db.storagePath);

db.defaults({
  genres: []
}).write();

mod.setGenres = function (object) {
  db.set('genres', object).write();
};

mod.setAuthString = function (string) {
  db.set('authString', string).write();
}

mod.loadGenres = function() {
  db.get('genres').value();
}