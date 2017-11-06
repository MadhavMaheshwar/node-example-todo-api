var env = process.env.NODE_ENV || 'development';
// console.log('env ****', env);

if(env === 'production') {
    process.env.MONGODB_URI = 'mongodb://db_todo_app:todoapp@ds249355.mlab.com:49355/todoapp';
} else if(env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;    
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest';
}