var express = require('express');
var router = express.Router();
var list_m = require('../models/list');
var async = require("async");

router.get('/addtopic', function (req, res) {
    // 在登录状态下可以添加主题
    if (req.session.user) {
        var title = req.query.title,
            md = req.query.md,
            html = req.query.html,
            uid = req.session.user.uid,
            content=req.query.content,
            createtime = parseInt(Date.now() / 1000);

        var params = {
            uid: uid,
            title: title,
            md: md,
            html:html,
            createtime: createtime,
            content:content
        };

        list_m.addTopic(params, function (result) {
            // console.log(result);
            if (result.affectedRows) {
                res.json({
                    code: 0,
                    msg: '添加成功',
                    data: {
                        url: '/list/' + result.insertId + '.html',
                        title: title,
                        author: req.session.user.username,
                        createtime: createtime,
                    }
                });
            } else {
                res.json({
                    code: 2,
                    msg: '添加失败，请重新尝试'
                })
            }
        });

    } else {
        res.json({
            code: 1,
            msg: '您还未登录'
        })
    }
})


router.get('/:pid.html', function (req, res) {
    var pid = req.query.id || 1;

    async.parallel([
        function (callback) {
            list_m.getListById(pid, function (result) {
                callback(null, result[0]);
            })
        },
        function (callback) {
            list_m.getReplyById(pid, function (result) {
                callback(null, result);
            })
        },
    ], function (err, results) {
        // console.log( results );
        // res.json(results);
        var id = req.session.user ? req.session.user.uid : 0;
        res.render('list', {
            data: results,
            userId: id,
        });
    })

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