const express = require('express');
const router = express.Router();
const homeFunctions = require('../../controllers/student/home');

router.get('/student/home', (req, res) => {
    if(req.user) {
        res.render('student_home', {user: req.user.name});
    }else {
        res.redirect('/');
    }
} )

router.get('/api/student/myCourse', homeFunctions.myCourse);

router.post('/api/student/home/withdrawCourse', homeFunctions.withdrawCourse);


module.exports = router;
