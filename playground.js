const bcrypt = require('bcryptjs');

var password = '$2a$10$yZQZPKvyNj2TyJIaw0opaOLzY8gmwUuTfSWgsSDbLedVM7IuKK4bO';
var hashed;

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         hashed = hash;
//         console.log(hashed);
//         bcrypt.compare(password, hashed, (err, res) => {
//             console.log(res);
//         });
//     });
// });


var hashed = '$2a$10$XHzTSv3GLnP2RvMmL6qsHO1FfAVdjE2aA4Oo7k0pppRByrR.lkifi';

bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
});