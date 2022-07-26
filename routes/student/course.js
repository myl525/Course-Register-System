const express = require('express');
const router = express.Router();
const courseFunctions = require('../../controllers/student/course');

router.get('/student/course', (req, res) => {
    if(req.user) {
        res.render('student_course', {user: req.user.name});
    }else {
        res.redirect('/');
    }
} )

router.post('/api/student/course/registerCourse', courseFunctions.registerCourse);

module.exports = router
