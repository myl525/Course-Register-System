const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userFunction = require('../controllers/user');

//login
router.post('/api/login', userFunction.login);
//register
router.post('/api/register', userFunction.register);
//logout
router.get('/api/logout', userFunction.logout);

module.exports = router;