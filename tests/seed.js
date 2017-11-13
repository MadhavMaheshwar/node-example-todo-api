
const { ObjectID } = require('mongodb');
const jwt =  require('jsonwebtoken');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');


const idUserOne = new ObjectID();
const idUserTwo = new ObjectID();

const users = [{
    _id: idUserOne,
    email: 'mead@io.com',
    password: 'Admin@123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: idUserOne.toHexString(), access:'auth'}, '@bc123').toString()
    }]
}, {
    _id: idUserTwo,
    email: 'andrew@it.com',
    password: 'Admin@123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: idUserTwo.toHexString(), access:'auth'}, '@bc123').toString()
    }]   
}];

const users2 = [{
    _id: idUserOne,
    email: 'mead@io.com',
    password: '$2a$10$FZoGy1c7VEzxCQFEKG8XouAaAXiT5kWUd3APJS3x6Jo5HMDusn5nm',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: idUserOne.toHexString(), access:'auth'}, '@bc123').toString()
    }]
}, {
    _id: idUserTwo,
    email: 'andrew@it.com',
    password: '$2a$10$FZoGy1c7VEzxCQFEKG8XouAaAXiT5kWUd3APJS3x6Jo5HMDusn5nm',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: idUserTwo.toHexString(), access:'auth'}, '@bc123').toString()
    }]   
}];


const populateUsers = (done) => {
    User.remove({}).then(() => {

        return User.insertMany(users2);
    }).then(() => done());
};

const todos = [{
    _id: new ObjectID(),
    text: 'First task',
    _creator: idUserOne
}, {
    _id: new ObjectID(),
    text: 'Second task',
    completed: true,
    completedAt: new Date().getTime(),
    _creator: idUserTwo
}];


const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};


module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};