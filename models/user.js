
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            trim: true,
            required: true
        },
        token: {
            type: String,
            trim: true,
            required: true
        }
    }]
});



UserSchema.methods.toJSON = function () {
    var user = this;
    return _.pick(user, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
};


// UserSchema.pre('save', function (next) {
//     var user = this;
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(user.password, salt, (err, hash) => {
//             bcrypt.compare(user.password, hash, (err, res) => {
//                 console.log('Saving user', res);
//                 user.password = hash;
//                 console.log('Saving user', user.password);
//                 next();
//             });
//         });
//     });
// });

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user)
            return Promise.reject();

        return new Promise((resolve, reject) => {
            // if(password === user.password)
            // resolve(user);
            // else
            // reject();
            bcrypt.compare(password, user.password, (err, res) => {
                if (res)
                resolve(user);
                else
                    reject();
            });
        });
    });
};


UserSchema.methods.removeTokens = function (token) {
    var user = this;

    return user.update({
        $pull:{
            tokens: {
                token
            }
        }
    });
};

UserSchema.methods.hashPassword = function () {
    var user = this;
    return bcrypt.genSalt(10).then( (salt) => {
        return bcrypt.hash(user.password, salt);
    }).then((hash) => {
        user.password = hash;
}).catch((err) => {
    return Promise.reject(err);
});
};



    var User = mongoose.model('User', UserSchema);




    module.exports = { User };


// validate: {
//     validator: (value) => {
//         return validator.isEmail(value);
//     },
//     message: '{VALUE} is not a valid email'
// }


// crypto-js library to use SHA256
// NOT FOR ACTUAL PROJECT