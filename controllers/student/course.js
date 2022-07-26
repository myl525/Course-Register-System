const mongoose = require('mongoose');
require('../../config/db')
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

const registerCourse = async (req, res) => {
    if(req.user) {
        const username = req.user.username;
        const courseName = req.body.courseName;
        const courseId = req.body.courseId;
        const courseSection = req.body.courseSection;
        const filter = {courseName: courseName, courseId: courseId, courseSection: courseSection};

        const student = await Student.findOne({username: username});
        const course = await Course.findOne(filter);

        if(course.listOfStudents.includes(username)) {
            res.json({alreadyRegistered: true});
        }else {
            course.listOfStudents.push(username);
            course.currentStudents += 1;
            await course.save();
            student.courses.push(filter);
            await student.save();
            res.json({courseRegister: true});
        }
    }else { 
        res.redirect('/');
    }
}

module.exports = {
    registerCourse
}