/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const bodyParser = require("body-parser");
//Require mongoose for DB; set up database
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
};

//Create schema
  mongoose.connect(process.env.DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  const { Schema } = mongoose;
  const librarySchema = new Schema(
    {
      book_title: { type: String, required: true },
      comments: { type: Array, default: [], required: true },
      commentcount: { type: Number, default: 0, required: true }
    });
  let Library = mongoose.model("Library", librarySchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      /*You can send a GET request to /api/books and receive a JSON response representing all the books. 
      The JSON response will be an array of objects with each object (book) containing title, _id, and commentcount properties.*/
      Library.find({}, (err, data) => {
        if (err) return res.json("no books exist");
        return res.json(data);
      })
    })
    
    .post(function (req, res) {
      let title = req.body.title; //Given by default
      //response will contain new book object including atleast _id and title
      /*You can send a POST request to /api/books with title as part of the form data to add a book. 
      The returned response will be an object with the title and a unique _id as keys. 
      If title is not included in the request, the returned response should be the string missing required field title.*/
      let newBook = new Library({book_title: title});
      if (title && title.trim() !== "") {
        newBook.save((err, data) => {
          if (!err && data) {
            let result = {
              _id: data._id,
              title: data.book_title
            };
            return res.json(result);
          } 
          else {
            return err
          };
        })
      } else return res.json("missing required field title")
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      /* You can send a DELETE request to /api/books to delete all books in the database. 
      The returned response will be the string 'complete delete successful' if successful.*/
      Library.deleteMany({}, (err, result) => {
        if (err && !result) {
          return err
        }
        else 
        {
          return res.json("complete delete successful");
        }
      });    
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;  //Given by default
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
      /*      You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing the properties title, _id, and a comments array (empty array if no comments present). If no book is found, return the string no book exists.*/

      if (bookid && bookid.trim() !== "") {
        Library.find({ _id: bookid }, (err, data) => {
          if (!err && data.length > 0) {
            return res.json({
              _id: data[0]['_id'],
              title: data[0]['book_title'],
              comments: data[0]['comments']
            });
          } else {
            return res.json("no book exists");
          }
        })
      } else {
          res.redirect('/api/books');
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;  //Given by default
      let comment = req.body.comment;  //Given by default
      //json res format same as .get
    
       /*You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book. 
      The returned response will be the books object similar to GET /api/books/{_id} request in an earlier test. 
      If comment is not included in the request, return the string missing required field comment. 
      If no book is found, return the string no book exists.*/
      if (bookid && bookid.trim() !== ""){
          if (comment && comment.trim() !== "") {
            let update = {
              $push: {comments: comment}, 
              $inc: {commentcount: 1}
            };
            Library.findByIdAndUpdate(bookid, update, {new: true}, (err, data) => {
              // If there is no error
              if(!err && data) {
                return res.json({
                  _id: data['_id'],
                  title: data['book_title'],
                  comments: data['comments']
                });
              }  
              else return res.json("no book exists");
            })
          }
          else {
            return res.json("missing required field comment")
          }        
      } else {
          res.redirect('/api/books'); 
      }
    })
    
    .delete(function(req, res){  
      let bookid = req.params.id; //Given by default
      //if successful response will be 'delete successful'
    
      /*You can send a DELETE request to /api/books/{_id} to delete a book from the collection. 
        The returned response will be the string delete successful if successful. 
        If no book is found, return the string no book exists.*/

      if (bookid && bookid.trim() !== "") {
        Library.deleteOne({_id: bookid}, (err, result) => {
          if (!err && result.deletedCount !== 0) {
            return res.json("delete successful")
          } else {
            return res.json("no book exists")
          };
        })
      } else {
          res.redirect('/api/books'); 
      }
    });
};
