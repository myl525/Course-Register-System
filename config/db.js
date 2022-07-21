let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 dbconf = 'mongodb://localhost/CRS';
}

// db.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect(dbconf);

// schemas
const Course = new mongoose.Schema({
    courseName: String,
    courseId: String,
    courseSection: String,
    maximumStudents: Number,
    currentStudents: Number,
    listOfStudents: [String],
    instructor: String,
    location: String
})

const Admin = new mongoose.Schema({
    username: String,
    password: String,
})

const Student = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    courses: [Course]
});

Admin.plugin(passportLocalMongoose);
Student.plugin(passportLocalMongoose);

mongoose.model('Course', Course);
mongoose.model('Admin', Admin);
mongoose.model('Student', Student);