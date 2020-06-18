const express = require('express');
const Datastore = require('nedb');
const sa = require('superagent');


const db = new Datastore('database.db');
db.loadDatabase();

const router = express.Router();

router.post('/add', (req, res) => {
     if(!req.body.title || (!req.body.author || (!req.body.isbn || !req.body.price))) {
        res.status(400).send("Bad Request");
     } else {
        db.find({isbn:req.body.isbn}, function(err,docs) {
            if(err) {
                res.status(500).send("Try again");
            } else {
            if(docs.length == 0) { // New book entry
                let newBook = req.body;
                newBook.quantity = 1;
                db.insert(newBook); 
                res.status(200).send("Added the book");
            } else { // Existing book (increase quantity)
                db.update({isbn: docs[0].isbn}, { $inc: { quantity: 1 }}, {}, function(err,n) {
                    res.status(200).send("Incremented the quantity by 1");
                });
            }
        }
        });
     }
});

router.get('/search/:b', (req, res) => {
    const search = req.params.b;
    // creating regex to search in author and title
    const regex = new RegExp(search, "gi");
    db.find({$or: [{ title: regex  }, { author: regex  }, { isbn: search }]}, function(err,docs) {
        if(err) {
                res.status(500).send("Try again");
        } else {
            if(docs.length == 0) {
                res.status(404).send("Sorry we do not have this book :(");
            } else {
                docs.push({total: docs.length});
                res.status(200).send(docs);
            }
        }
    });
});

router.get('/media-coverage/:isbn', (req, res) => {
     const isbn = req.params.isbn;
     db.find({"isbn":isbn}, function(err,docs) {
            if(docs.length == 0 ) {
                res.status(404).send(`No book with isbn ${isbn}`);
            } else {
                const title = docs[0].title;
                sa.get("https://jsonplaceholder.typicode.com/posts")
                .end((err,resp) => {
                    if(err) {
                        console.log(err);
                        res.status(404).send("Unable to fetch media coverage at the moment :(");
                    } else {
                        let opt = [];
                        resp.body.forEach(element => {
                            if(element.title.includes(title) || element.body.includes(title)) {
                                opt.push(element);
                            }
                        });
                        res.status(200).send(opt);
                    }
                });

            }
     });
});

router.post('/buy/:isbn', (req, res) => { 
    db.find({isbn:req.params.isbn}, function(err,docs) {
        if(err) {
            res.status(500).send("Try again");
        } else {
        if(docs.length == 0) {
            res.status(404).send("Sorry this book is not available :(");
        } else {
            if(docs[0].quantity==1) {
                // skipping the dec as we have to add new book when quant becomes zero
                res.status(200).send("Thanks for shopping");
            } else{
            db.update({isbn: docs[0].isbn}, { $inc: { quantity: -1 }}, {}, function(err,n) {
                if(err){
                    res.status(500).send("Try again :(");
                } else {
                 res.status(200).send("Thanks for shopping");
                }
            });
         }
        }
    }
    });
});

// below are the apis used in testing

router.post('/delete/:isbn', (req, res) => {
    db.remove({isbn:req.params.isbn}, { multi: true },function(err, n) {
        if(err) {
            res.status(500).send("Failed to delete the book with isbn - " + req.params.isbn);
        } else {
            res.status(200).send("deleted the book with isbn - " + req.params.isbn);
        }
    });
});

module.exports = router;