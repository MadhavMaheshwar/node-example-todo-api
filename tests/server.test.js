

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { populateTodos } = require('./../tests/seed');
const { populateUsers } = require('./../tests/seed');
const { todos } = require('./../tests/seed');
const { users } = require('./../tests/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Something todo';

        request(app).post('/todos').send({ text })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not create todo with invalid body', (done) => {
        var text = 'Something todo';

        request(app).post('/todos').send({})
        .set('x-auth', users[0].tokens[0].token)
        .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));

            });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app).get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
            .expect((res) => {
                expect(res.body.docs.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {

    it('should return doc', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe(id);
            })
            .end(done);
    });

    it('should not return doc created by other user', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).get(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = '59fef84fc8cb0c0fd7a9ecd1';
        request(app).get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
            .end(done);
    });

    it('should return 404 if invalid ObjectID', (done) => {
        var id = 'ABCD';
        request(app).get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/id', () => {

    it('should remove a todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe(id);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.findById(id).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not return doc created by other user', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = '59fef84fc8cb0c0fd7a9ecd1';
        request(app).delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
            .end(done);
    });

    it('should return 404 if invalid ObjectID', (done) => {
        var id = 'ABCD';
        request(app).delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
            .end(done);
    });
});




describe('PATCH /todos/id', () => {

    it('should update a todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).patch(`/todos/${id}`)
            .send({ text: 'First todo app', completed: true })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe(id);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.findById(id).then((todo) => {
                    expect(todo.completed).toBe(true);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not return doc created by other user', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).patch(`/todos/${id}`)
        .send({ text: 'First todo app', completed: true })
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
            .end(done);
    });

    it('should NOT update todo when data is null', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).patch(`/todos/${id}`)
            .send({})
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                Todo.findById(id).then((todo) => {
                    done();
                }).catch((e) => done(e));
            });
    });


    it('should return 404 if todo not found', (done) => {
        var id = '59fef84fc8cb0c0fd7a9ecd1';
        request(app).patch(`/todos/${id}`)
            .send({ text: 'close todo app', completed: true })
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if invalid ObjectID', (done) => {
        var id = 'ABCD';
        request(app).patch(`/todos/${id}`)
            .send({ text: 'close todo app', completed: true })
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});






describe('POST /users', () => {
    it('should generate auth token and create a new user', (done) => {
        var email = 'udemy@io.com';
        var text = {
            email,
            password: 'abcdefg'
        };

        request(app).post('/users').send(text)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                User.findOne({ email }).then((user) => {
                    expect(user.email).toBe(email);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not create user with invalid body', (done) => {
        var text = 'Something todo';

        request(app).post('/users').send({ text })
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                User.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not create user if email already in use', (done) => {
        var text = {
            email: users[0].email,
            password: 'abcdefg'
        };
        request(app).post('/users').send({ text })
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                User.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));

            });
    });
});



describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app).get(`/users/me`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app).get(`/users/me`)
            .set('x-auth', "hello world")
            .expect(401)
            .end(done);
    });
});




describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        var email = 'udemy@io.com';
        var text = {
            email,
            password: 'abcdefg'
        };

        request(app).post('/users/login').send(users[0])
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(users[0].email);
            })
            .end((err, res) => {
                if (err)
                    return done(err);

                User.findOne({ email: users[0].email }).then((user) => {
                    expect(user.tokens[1].token).toBe(res.headers['x-auth']);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not authenticate user with invalid data', (done) => {
        var email = 'udemy@io.com';
        var text = {
            email,
            password: 'abcdefg'
        };
        request(app).post('/users/login').send(text)
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);

                User.findOne({ email }).then((user) => {
                    expect(user).toBeFalsy();
                    done();
                }).catch((e) => done(e));

            });
    });

});


describe('DELETE /users/me/token', () => {
    
        it('should remove token if valid', (done) => {
            request(app).delete(`/users/me/token`)
            .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if (err)
                        return done(err);
    
                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                });
        });
    
    });
    