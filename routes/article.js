var express = require('express');
var router = express.Router();
var article_m = require('../models/article');
var async = require("async");

router.get('/edit', function (req, res) {
    if (req.session.user) {
        if (req.query.id) {
            var id = req.query.id;
            async.parallel([
                function (callback) {
                    article_m.getListById(id, function (result) {
                        callback(null, result[0]);
                    })
                },
                function (callback) {
                    article_m.getReplyById(id, function (result) {
                        callback(null, result);
                    })
                },
            ], function (err, results) {
                // console.log( results );
                // res.json(results);
                var id = req.session.user ? req.session.user.uid : 0;
                res.render('article', {
                    data: results[0],
                    userId: id,
                    username: req.session.user.username,
                });
            });
        }
        res.render('article', {
            username: req.session.user.username,
            userId: req.session.user.uid
        });
    } else {
        res.redirect('/user');
    }
});
router.post('/addArticle', function (req, res) {
    // 在登录状态下可以添加主题
    if (req.session.user) {
        var title = req.body.title,
            md = req.body.md,
            html = req.body.html,
            uid = req.session.user.uid,
            content = req.body.content,
            createtime = parseInt(Date.now() / 1000);
        var params = {
            uid: uid,
            title: title,
            md: md,
            html: html,
            createtime: createtime,
            content: content
        };

        article_m.addArticle(params, function (result) {
            // console.log(result);
            if (result.affectedRows) {
                res.json({
                    code: 0,
                    msg: '添加成功',
                    data: {
                        url: `/list/article.html?id=${result.insertId}`,
                        title: title,
                        author: req.session.user.username,
                        createtime: createtime,
                    }
                });
            } else {
                res.json({
                    code: 2,
                    msg: '添加失败，请重新尝试'
                });
            }
        });

    } else {
        res.json({
            code: 1,
            msg: '您还未登录'
        });
    }
});


router.get('/:pid.html', function (req, res) {
    var pid = req.query.id || 1;
    async.parallel([
        function (callback) {
            article_m.getListById(pid, function (result) {
                callback(null, result[0]);
            })
        },
        function (callback) {
            article_m.getReplyById(pid, function (result) {
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

module.exports = router;