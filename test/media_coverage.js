const assert = require('assert');
const Datastore = require('nedb');
const request = require('supertest');
const app = require('./../server.js');

let db;

describe('Get The Media Coverage For Some Book', function() {

    before("media coverage pre-requisites", function() {
        db = new Datastore('database.db');
        db.loadDatabase();
    });

    it('get media coverage of a book using isbn', function(done) {
        request(app)
        .get('/book/media-coverage/book_102')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('get media coverage of a book that does not exist', function(done) {
        request(app)
        .get('/book/media-coverage/book_does_not_exist')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
});