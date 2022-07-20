const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const Student = mongoose.model('Student');

passport.use('adminLocal', new LocalStrategy(Admin.authenticate()));
passport.use('studentLocal', new LocalStrategy(Student.authenticate()));
passport.serializeUser(function(user, done) { 
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    if(user!=null){
        done(null,user);
    }
});