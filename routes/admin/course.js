const express = require('express');
const router = express.Router();

router.get('/admin/course', (req, res) => {
    if(req.user) {
        res.render('admin_course', {user: req.user.username, admin: true});
    }else {
        res.redirect('/');
    }
})

module.exports = router;