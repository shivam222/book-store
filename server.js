const express= require('express');
const bodyParser = require('body-parser');
const app= express();
const cors= require('cors');

const book= require('./handle/routes/book');

app.use(cors());
app.use(bodyParser.json());

app.use('/book',book);
app.get("*", (req, res) => {
    console.log(req);
    res.status(200).send("Welcome to the book store");
});

app.listen(4600,function(req,res){
    console.log('Running');
});

module.exports = app;