
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
    
    
    //  FIND ONE AND UPDATE
    // db.collection('ToDos').findOneAndUpdate({
    //     _id: new ObjectID('59fc6a4883342c961082e6b3')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then( (result) => {
    //     console.log(result);
    // });

    //  FIND ONE AND DELETE
    // db.collection('ToDos').findOneAndDelete({completed: false}).then( (result) => {
    //     console.log(result);
    // });

    //  DELETE MANY and ONE
    // db.collection('ToDos').deleteOne({todo: 'Exercise'}).then( (result) => {
    //     console.log(result.result);
    // });

    //  GET COUNT PROMISE
    // db.collection('ToDos').find().count().then( (count) => {
    //     console.log('ToDos Size', count);
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to fetch documents.', err);
    // });

    //  GET COUNT
    // db.collection('ToDos').find().count( (err, count) => {
    //     if(err) 
    //         return console.log('Unable to fetch count.', err);
    //    
    //     console.log('ToDos Size', count);
    //     db.close();
    // });

    //  FETCH DOCUMENTS
    // db.collection('ToDos').find({completed: false}).toArray().then( (docs) => {
    //     console.log('ToDos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    //     db.close();
    // }, (err) => {
    //     console.log('Unable to fetch documents.', err);
    // });

    //  INSERT ONE DOCUMENT
    // db.collection('ToDos').insertOne({
    //     todo: 'Something to do twice',
    //     completed: false
    // }, (err, result) => {
    //     if(err)
    //     return console.log('Unable to insert into collection!', err);
    // 
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    // db.close();
});