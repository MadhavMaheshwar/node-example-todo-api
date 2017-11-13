
require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');

var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.redirect('https://mead.io/');
});

app.post('/todos', authenticate, (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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


app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then((docs) => {
        res.send({ docs });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});

app.get('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({});

    Todo.findOne({
        _id: req.params.id,
        _creator: req.user._id
    }).then((doc) => {
        if (!doc)
            return res.status(404).send({ response: 'Unable to find Todo!' });
        res.send({ doc });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});


app.delete('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({});

    Todo.findOneAndRemove({
        _id: req.params.id,
        _creator: req.user._id
    }).then((doc) => {
        if (!doc)
            return res.status(404).send({ response: 'Unable to find Todo!' });
        res.send({ doc });
    }, (err) => {
        res.status(400).send({
            error: err.message
        });
    });
});


app.patch('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send({});

    var body = _.pick(req.body, ['text', 'completed']);
    if (_.isNil(body.completed) && _.isNil(body.text))
        return res.status(400).send({ response: 'Data input invalid!' });

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }

    Todo.findOneAndUpdate({
        _id: req.params.id,
        _creator: req.user._id
    },{
             $set: body 
            }, {
                 new: true
                 }
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




// app.post('/users', (req, res) => {
    
//         var user = new User(_.pick(req.body, ['email', 'password', 'tokens']));
    
//         user.hashPassword().then(() => {
//         user.save().then(() => {
//                 return user.generateAuthToken();
//             }).then((token) => {
//                 // include token in header. create custom header field with x-
//                 res.header('x-auth', token).send(user.toJSON());
//             }).catch((err) => {
//                 res.status(400).send({
//                     error: err.message
//                 });
//             });    
//         }, (err) => {
//             res.status(400).send({
//                 error: err.message
//             });
//         });
//     });

app.post('/users', (req, res) => {

    var user = new User(_.pick(req.body, ['email', 'password', 'tokens']));

    user.hashPassword().then(() => {
    return user.save().then(() => {
            return user.generateAuthToken();
        });
}).then((token) => {
    // include token in header. create custom header field with x-
    res.header('x-auth', token).send(user.toJSON());
}).catch((err) => {
    res.status(400).send({
        error: err.message
    });
});   
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/users/login', (req, res) => {

    var body = new User(_.pick(req.body, ['email', 'password']));
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user.toJSON());
        });
    }).catch((err) => {
        res.status(400).send({ response: 'Authentication Failed!' });
    });
});

// logout
app.delete('/users/me/token', authenticate, (req, res) => {
    
        req.user.removeTokens(req.token).then(() => {
            res.send({ response: 'Logged Out successfully' });
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