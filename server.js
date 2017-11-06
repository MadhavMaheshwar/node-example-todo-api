
require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');

var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
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
    Todo.find().then((docs) => {
        res.send({ docs });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});

app.get('/todos/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({});

    Todo.findById(req.params.id).then((doc) => {
        if (!doc)
            return res.status(404).send({ response: 'Unable to find Todo!' });
        res.send({ doc });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});


app.delete('/todos/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({});

    Todo.findByIdAndRemove(req.params.id).then((doc) => {
        if (!doc)
            return res.status(404).send({ response: 'Unable to find Todo!' });
        res.send({ doc });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});


app.patch('/todos/:id', (req, res) => {
    
        if (!ObjectID.isValid(req.params.id))
            return res.status(404).send({});
    

            var body = _.pick(req.body, ['text', 'completed']);
            if(_.isNil(body.completed) && _.isNil(body.text))
            return res.status(400).send({ response: 'Data input invalid!' });

            if(_.isBoolean(body.completed) && body.completed) {
                                body.completedAt = new Date().getTime();
                            } 

        Todo.findByIdAndUpdate(req.params.id,
            {$set:body}, {new: true}
        ).then((doc) => {
            if (!doc)
                return res.status(404).send({ response: 'Unable to find Todo!' });

            res.send({ doc });
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