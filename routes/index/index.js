const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(req.user) {
        //if user is already loggedIn, back to original page.
        res.redirect('back');
    }else {
        res.render('index', {index: true});
    }
})

module.exports = router;