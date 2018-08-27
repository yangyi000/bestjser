var express = require('express');
var router = express.Router();
var home_m = require('../models/home');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user) {
        var uid = req.session.user.uid;
        var username = req.session.user.username
        home_m.getArticle(uid, function (result) {
            res.render('home', {
                data: result,
                username: username,
                userId:uid
            });
        });

    }else{
        res.redirect('/user/login')
    }
});
module.exports = router;