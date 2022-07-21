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

module.exports = {
    getFilter,
    searchCourse
}
