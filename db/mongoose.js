
//      ./mongod --dbpath ~/Downloads/mongo-data

var mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://db_todo_app:todoapp@ds249355.mlab.com:49355/todoapp';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

module.exports = {
    mongoose
};

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp');


// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 3
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//         required: true
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// var newTodo = new Todo({
//     text: 'Courier package'
// });

// newTodo.save().then( (doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log('Unable to save Todo.', err);
// });


// var User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 3
//     },
//     email: {
//         type: String,
//         default: false,
//         trim: true,
//         required: true,
//         minlength: 3
//     },
// });

// var newUser = new User({
//     name: 'Andrew', 
//     email: 'andrew@gmail.com'
// });

// newUser.save().then( (doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log('Unable to save User.', err);
// });