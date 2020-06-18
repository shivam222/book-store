const assert = require('assert');
const Datastore = require('nedb');
const request = require('supertest');
const app = require('./../server.js');

let db;

describe('Add Book To The Store', function() {

    before("add book test pre-requisites", function() {
        db = new Datastore('database.db');
        db.loadDatabase();
    });

    it('add a book with all mandatory details', function(done) {
        request(app)
        .post('/book/add')
        .send({title: 'testing book', author: 'tester 1', price: 100, isbn: "book_test_1"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.text);
          done();
        });
    });

    it('add a book without author field', function(done) {
        request(app)
        .post('/book/add')
        .send({title: 'testing book', price: 100, isbn: "book_test_2"})
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.text);
          done();
        });
    });

    after("cleaning up", function(done) {
        request(app)
        .post('/book/delete/book_test_1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.text);
          done();
        });        
    });

});