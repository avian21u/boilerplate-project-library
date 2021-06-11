/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'book_title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    // All 10 functional tests required are complete and passing.
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let test_title = 'Chai Test Book Title';
        chai.request(server)
        .post('/api/books')
        .send({
          title: test_title
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body.title, test_title, "Book title should be saved to DB");
          assert.notEqual(res.body._id, null, "ID should not be Null");
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body,'missing required field title.', "Error message should be shown when no title given");
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .query({})
        .end(function(err, res){
            assert.equal(res.status, 200, "Status should be 200");
            assert.isArray(res.body, 'Response project should be an array: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}');
            assert.property(res.body[0], '_id', 'Response object should contain an ID field.');
            assert.property(res.body[0], 'book_title', 'Response object should contain book title.');
            assert.property(res.body[0], 'comments', 'Response object should contain comments field.');
            assert.property(res.body[0], 'commentcount', 'Response object should contain a comment count field.');
            done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let test_id = "gadkubgdg";
        chai.request(server)
        .get('/api/books/' + test_id)
        .query({})
        .end(function(err, res){
            assert.equal(res.status, 200, "Status should be 200");
            assert.equal(res.body,'no book exists.', "Error message should be shown when ID not in database");
            done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        let test_id = "60c3a857a2856f623c50d90a";
        chai.request(server)
        .get('/api/books/' + test_id)
        .query({})
        .end(function(err, res){
            assert.equal(res.status, 200, "Status should be 200");
            assert.property(res.body[0], '_id', 'Response object should contain an ID field.');
            assert.property(res.body[0], 'book_title', 'Response object should contain book title.');
            assert.property(res.body[0], 'comments', 'Response object should contain comments field.');
            assert.property(res.body[0], 'commentcount', 'Response object should contain a comment count field.');
            done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let test_id = "60c3a857a2856f623c50d90a";
        let test_comment = 'Chai Test Comment';
        chai.request(server)
        .post('/api/books/' + test_id)
        .send({
          _id: test_id,
          comment: test_comment
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.include(res.body[0].comments, test_comment, "Comment array should include the new comment");
          assert.notEqual(res.body[0].commentcount, 0, "Comment count should be more than 0");
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let test_id = "60c3a857a2856f623c50d90a";
        let test_comment = '';
        chai.request(server)
        .post('/api/books/' + test_id)
        .send({
          _id: test_id,
          comment: test_comment
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body,'missing required field comment.', "Error message should be shown when comment is not provided.");
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let test_id = "gadkubgdg";
        let test_comment = 'test comment';
        chai.request(server)
        .post('/api/books/' + test_id)
        .send({
          _id: test_id,
          comment: test_comment
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body,'no book exists.', "Error message should be shown when ID is not in database.");
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        let test_id = "60c3a85da2856f623c50d90b";
        chai.request(server)
        .delete('/api/books/' + test_id)
        .send({
          _id: test_id
        })
         .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body,"delete successful");
            done();
        })  
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let test_id = "gadkubgdg";
        chai.request(server)
        .delete('/api/books/' + test_id)
        .send({
          _id: test_id
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body,"no book exists");
          done();
        })
      });

    });

  });

});
