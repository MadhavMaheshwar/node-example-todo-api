
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then( (doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send({
            error: err.message
                });        
    });

    // console.log(req.body);
    // res.send({response: 'Request Acknowledged!'});
});


app.get('/todos', (req, res) => {
    Todo.find().then( (docs) => {
        res.send({docs} );
    }, (err) => {
        res.status(400).send({
            error: err.message
                });   
    });
});

app.get('/todos/:id', (req, res) => {

    if(!ObjectID.isValid(req.params.id))
    return res.status(404).send({});
    
    Todo.findById(req.params.id).then( (doc) => {
        if(!doc)
        return res.status(404).send({response: 'Unable to find Todo!'});
        res.send({doc});
    }, (err) => {
        res.status(400).send({
            error: err.message
                });   
    });
});




app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});


module.exports = { app };