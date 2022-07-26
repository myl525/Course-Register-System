const mongoose = require('mongoose');
require('../../config/db')
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

const myCourse = async (req, res) => {
    const student = await Student.findOne({username: req.user.username});
    
    let courses = [];
    for await (let course of student.courses) {
        const temp = await Course.findOne(course);
        courses.push(temp);
    }   
    
    res.json(courses.map((ele) => {return ele}));
}

const withdrawCourse = async (req, res) => {
    const username = req.user.username;
    const courseName = req.body.courseName;
    const courseId = req.body.courseId;
    const courseSection = req.body.courseSection;
    const filter = {courseName: courseName, courseId: courseId, courseSection: courseSection};

    const student = await Student.findOne({username: username});
    const course = await Course.findOne(filter);

    const index = course.listOfStudents.indexOf(username);
    course.listOfStudents.splice(index,1);
    course.currentStudents -= 1;
    await course.save();

    for(let i=0; i<student.courses.length; i++) {
        const temp = student.courses[i];
        if(temp.courseName == courseName && temp.courseId == courseId && temp.courseSection == courseSection){
            student.courses.splice(i,1);
            break;
        }
    }
    await student.save();

    res.json({courseWithdraw: true});
}

module.exports = {
    myCourse,
    withdrawCourse
}