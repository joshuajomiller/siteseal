let express = require('express');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/search', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
