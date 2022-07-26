const mongoose = require('mongoose');
require('../../config/db')
const Course = mongoose.model('Course');

const getFilter = (req, res) => {
    const filter = {};
    const searchStr = req.query['courseSearchStr'] || null;
    const format = /[A-Z]{4}-[A-Z]{2}.[0-9]{4}/;

    if(searchStr) {
        if(format.test(searchStr)) {
            filter['courseId'] = searchStr;
        }else {
            filter['courseName'] = searchStr;
        }
    }

    return filter;
}

const searchCourse = async (req, res) => {
    if(req.user) {
        const filter = getFilter(req, res);
        const results = await Course.find(filter);
        res.json(results.map((ele) => {return ele}));
    }else {
        res.redirect('/');
    }
}

const addCourse = async (req, res) => {
    //get data
    const courseName = req.body.courseName;
    const courseId = req.body.courseId;
    const courseSection = req.body.courseSection;
    const maximumStudents = req.body.maximumStudents;
    const instructor = req.body.instructor;
    const location = req.body.location;
    //add course to db
    const exist = await Course.findOne({courseName: courseName, courseId: courseId, courseSection: courseSection});
    if(exist) {
        res.json({'alreadyExists': true});
    }else {
        const newCourse = new Course({
            courseName: courseName,
            courseId: courseId,
            courseSection: courseSection,
            maximumStudents: maximumStudents,
            currentStudents: 0,
            listOfStudents: [],
            instructor: instructor,
            location: location
        });
        await newCourse.save();
        res.json({'alreadyExists': false});
    }
}

const editCourse = async (req, res) => {
    //get data
    const filter = {courseId: req.body.courseId, courseSection: req.body.courseSection};
    const columns = ['courseName', 'maximumStudents', 'instructor', 'location'];
    let update = {};
    columns.forEach((col) => {
        if(req.body[col]) {
            update[col] = req.body[col];
        }
    })

    const result = await Course.findOneAndUpdate(filter, update, {new: true});
    if(result) {
        res.json({update: true});
    }
}

const deleteCourse = async (req, res) => {
    //get data
    const courseId = req.body.courseId;
    const courseSection = req.body.courseSection;
    const filter = {courseId: courseId, courseSection: courseSection};
    const result = await Course.deleteOne(filter);
    res.json({delete: result});
}


module.exports = {
    getFilter,
    searchCourse,
    addCourse,
    editCourse,
    deleteCourse
}
