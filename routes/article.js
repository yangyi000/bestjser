var express = require('express');
var router = express.Router();
var list_m = require('../models/list');
var async = require("async");

router.get('/edit', function (req, res) {
    if (req.session.user) {
        res.render('article', {
            username: req.session.user.username,
            userId: req.session.user.uid
        });
    }
});
router.post('/addReply', function (req, res) {
    if (req.session.user) {
        console.log(req.session.user)
        var content = req.body.content,
            createtime = parseInt(Date.now() / 1000);
        var params = {
            uid: req.session.user.uid,
            pid: req.query.id,
            content: content,
            createtime: createtime,
            name: req.session.user.username
        };
        list_m.addReply(params, function (result) {
            if (result.affectedRows) {
                console.log('评论成功');
                res.redirect('article.html?id=' + req.query.id);
            }
        })
    } else {
        res.json({
            code: 1,
            msg: '您还未登录'
        })
    }
});

router.post('/delete', function (req, res) {
    if (req.session.user) {
        console.log(req.session.user)
        var content = req.body.content,
            createtime = parseInt(Date.now() / 1000);
        var params = {
            pid: req.query.id,
        };
        list_m.addReply(params, function (result) {
            if (result.affectedRows) {
                console.log('评论成功');
                res.redirect(req.query.id + '.html');
            }
        })
    } else {
        res.json({
            code: 1,
            msg: '登陆链接失效，请重新登陆'
        })
    }
})

module.exports = router;