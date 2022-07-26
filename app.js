//basic setup
require('./config/db');
require('./config/passport');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//mongoose setup
const mongoose = require('mongoose');

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//session setup
const session = require('express-session');
const sessionOptions = {
    secret: 'asdfghjkl',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));
//passport setup
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
//
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});
//routes
const index = require('./routes/index/index');
const user = require('./routes/user');
const adminCourse = require('./routes/admin/course');
const adminStudent = require('./routes/admin/student');
const studentCourse = require('./routes/student/course');
const studentHome = require('./routes/student/home');
//
app.use('/', index);
app.use('/', user);
app.use('/', adminCourse);
app.use('/', adminStudent);
app.use('/', studentCourse);
app.use('/', studentHome);


app.listen(3000);