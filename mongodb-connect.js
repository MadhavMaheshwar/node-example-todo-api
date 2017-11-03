
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var user = { name: 'andrew', age: 23 };
var {name} = user;
console.log('The name is', name);

var obj = ObjectID();
console.log('The objectID is', obj);


MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err)
    return console.log('Unable to connect to MongoDB!');

    console.log('Connected to MongoDB!');
    
    
    db.collection('ToDos').find().count().then( (count) => {
        console.log('ToDos Size', count);
        db.close();
    }, (err) => {
        console.log('Unable to fetch documents.', err);
    });

    // db.collection('ToDos').find().count( (err, count) => {
    //     if(err) 
    //         return console.log('Unable to fetch count.', err);
       
    //     console.log('ToDos Size', count);
    //     db.close();
    // });

    // db.collection('ToDos').find({completed: false}).toArray().then( (docs) => {
    //     console.log('ToDos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to fetch documents.', err);
    // });

    // db.collection('ToDos').insertOne({
    //     todo: 'Something to do twice',
    //     completed: false
    // }, (err, result) => {
    //     if(err)
    //     return console.log('Unable to insert into collection!', err);

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    // db.close();
});