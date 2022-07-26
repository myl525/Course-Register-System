const mongoose = require('mongoose');
require('../../config/db')
const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

const searchStudent = async (req, res) => {
    if(req.user) {
        const searchStr = req.query['studentSearchStr'] || null;
        if(searchStr) {
            let results = await Student.find({username: searchStr});
            if(results.length > 0) {
                res.json(results.map((ele) => {return ele}));
            }else {
                results = await Student.find({name: searchStr});
                res.json(results.map((ele) => {return ele}));
            }
        }else {
            const results = await Student.find({});
            res.json(results.map((ele) => {return ele}));
        }
    }else {
        res.redirect('/');
    }
}

const registerCourse = async (req, res) => {
    if(req.user) {
        const courseName = req.body.courseName;
        const courseId = req.body.courseId;
        const courseSection = req.body.courseSection;
        const filter = {courseName: courseName, courseId: courseId, courseSection: courseSection};
        const username = req.body.username;

        const student = await Student.findOne({username: username});
        const course = await Course.findOne(filter);

        if(course) {
            if(course.currentStudents === course.maximumStudents) {
                res.json({courseFull: true});
            }else if(course.listOfStudents.includes(username)) {
                res.json({alreadyRegistered: true});
            }else {
                student.courses.push(course);
                await student.save();
                course.listOfStudents.push(username);
                course.currentStudents += 1;
                await course.save();
                res.json({courseRegister: true});
            } 
        }else {
            res.json({courseNotFound: true});
        }
    }else {
        res.redirect('/');
    }
}

module.exports = {
    searchStudent,
    registerCourse
}