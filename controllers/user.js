const mongoose = require('mongoose');
const passport = require('passport');
require('../config/db');
const Admin = mongoose.model('Admin');
const Student = mongoose.model('Student');

const login = (req, res, next) => {
    if(req.body.identity === 'Admin') {
        passport.authenticate('adminLocal', (err, user) => {
            if(user) {
                req.logIn(user, (err) => {
                    res.send({loggedIn: true, user: req.user.username});
                });
            }else {
                res.send({loggedIn: false, msg: "Your username or password is incorrect"});
            }
        })(req, res, next);
    }else {
        passport.authenticate('studentLocal', (err, user) => {
            if(user) {
                req.logIn(user, (err) => {
                    res.send({loggedIn: true, user: req.user.username});
                });
            }else{
                res.send({loggedIn: false, msg: "Your username or password is incorrect"});
            }   
        })(req, res, next);
    }
}

const register = (req, res) => {
    Student.findOne({username: req.body.username}, (err, result) => {
        if(err) {
            console.log(err);
        }
        if(result) {
            res.send({loggedIn: false, error: "repeat username"});
        }else{
            Student.register(new Student({username: req.body.username, name: req.body.name}), req.body.password, function(err, user){
                if(err){
                    console.log(err);
                    res.send({loggedIn: false, error: "invalid info"});
                }else{
                    passport.authenticate('studentLocal')(req, res, function(){
                        res.send({loggedIn: true, user: req.user.username});
                    })
                }
            })
        }
    })
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect('/');
    });
}

const createAdmin = () => Admin.register(new Admin({username: 'Admin'}), 'Admin001', function(err, user){
    passport.authenticate('adminLocal');
})

module.exports = {
    createAdmin,
    login,
    register,
    logout
}