const express = require('express');
const router = express.Router();
const studentFunctions = require('../../controllers/admin/student');

router.get('/admin/student', (req, res) => {
    if(req.user) {
        res.render('admin_student', {user: req.user.username, admin: true});
    }else {
        res.redirect('/');
    }
})

router.get('/api/admin/student', studentFunctions.searchStudent);

router.post('/api/admin/student/registerCourse', studentFunctions.registerCourse);

module.exports = router;