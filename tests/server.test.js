

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First task'
},{
    _id: new ObjectID(),
    text: 'Second task'
}];

beforeEach( (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then( () => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Something todo';

        request(app).post('/todos').send({text})
        .expect(200)
        .expect( (res) => {
            expect(res.body.text).toBe(text);
        })
        .end( (err, res) => {
            if(err)
            return done(err);

            Todo.find({text}).then( (todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch( (e) => done(e));
            
        });
    });

    it('should not create todo with invalid body', (done) => {
        var text = 'Something todo';

        request(app).post('/todos').send({})
        .expect(400)
        .end( (err, res) => {
            if(err)
            return done(err);

            Todo.find().then( (todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch( (e) => done(e));
            
        });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app).get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.docs.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/id', () => {
    
        it('should return doc', (done) => {
            var id = todos[0]._id.toHexString();
            request(app).get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe(id);
            })
            .end(done);
        });

        it('should return 404 if todo not found', (done) => {
            var id = '59fef84fc8cb0c0fd7a9ecd1';
            request(app).get(`/todos/${id}`)
            .expect(404)
            .end(done);
        });

        it('should return 404 if invalid ObjectID', (done) => {
            var id = 'ABCD';
            request(app).get(`/todos/${id}`)
            .expect(404)
            .end(done);
        });
    });