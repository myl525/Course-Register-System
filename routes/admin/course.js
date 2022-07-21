const express = require('express');
const router = express.Router();
const courseFunctions = require('../../controllers/admin/course');

router.get('/admin/course', (req, res) => {
    if(req.user) {
        res.render('admin_course', {user: req.user.username, admin: true});
    }else {
        res.redirect('/');
    }
})

router.get('/api/admin/course', courseFunctions.searchCourse);

module.exports = router;