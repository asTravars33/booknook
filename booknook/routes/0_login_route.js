#!/usr/bin/nodejs

var express = require('express');
const router = express.Router();

// endpoint handlers
router.get('/', function(req, res){
    res.render('0_login', {'func': "show_login()", 'message': 'Have an account? Log in instead!'});
});
router.get('/login-box', function(req, res){
    res.render('0_login_box');
});
router.get('/signup-box', function(req, res){
    res.render('0_signup_box');
});
router.get('/signup', function(req, res){
    const {username, password} = req.query;
    var sql = "CALL addUser(?,?,?);";
    res.app.locals.pool.query(sql, ["", username, password], function(error, results, fields){
        if(results!==undefined && results[0]!==undefined){
            req.session.profile = results[0][0];
            res.redirect('./books');
        }
        else{
            res.render('0_login', {'func': "show_login()", 'message': "There is an account associated with this username. Log in?"});
        }
    });
});
router.get('/login', function(req, res, next){
    const {email, password} = req.query;
    var sql = "SELECT * FROM users WHERE email=?;";
    res.app.locals.pool.query(sql, [email], function(error, results, fields){
        if(results!==undefined && results[0]!==undefined){
            req.session.profile = results[0];
            res.locals.password = password;
            next();
        }
        else{
            res.render('0_login', {'func': "show_signup()", 'message': "This email does not exist. Create an account?"});
            return;
        }
    });
},
function(req, res, next){
    var sql = "SELECT password FROM users WHERE userId=?";
    res.app.locals.pool.query(sql, [req.session.profile.userId], function(error, results, fields){
        if(results[0].password == res.locals.password){
            res.redirect('./books');
        }
        else{
            res.render('0_login', {'func': "show_signup()", 'message': "This email does not exist. Create an account?"});
        }
    });
});
module.exports = router;