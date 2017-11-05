
var mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        default: false,
        trim: true,
        required: true,
        minlength: 3
    },
});

module.exports = { User };