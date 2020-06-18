const assert = require('assert');
const Datastore = require('nedb');
const request = require('supertest');
const app = require('./../server.js');

let db;

describe('Search a book in the store', function() {

    before("media coverage pre-requisites", function() {
        db = new Datastore('database.db');
        db.loadDatabase();
    });

    it('search book using isbn', function(done) {
        request(app)
        .get('/book/search/book_testing_1001')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('search book using incorrect isbn', function(done) {
        request(app)
        .get('/book/search/book_testing_00')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('search book using partial title', function(done) {
        request(app)
        .get('/book/search/remove')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
});