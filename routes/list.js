var express = require('express');
var router = express.Router();
var article_m = require('../models/article');
var async = require("async");

router.get('/:pid.html', function (req, res) {
    var pid = req.query.id || 1;

    async.parallel([
        function (callback) {
            article_m.getListById(pid, function (result) {
                callback(null, result[0]);
            });
        },
        function (callback) {
            article_m.getReplyById(pid, function (result) {
                callback(null, result);
            });
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
    var pid = req.query.id;
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
        var replynum ;
        async.parallel([
            function (callback) {
                article_m.getListById(pid, function (result) {
                    replynum = result[0].replynum + 1 || 1;
                    callback(null, params,replynum);
                });
            }
        ], function (err, results) {
            article_m.addReply(results[0], function (result) {
                if (result) {
                    console.log('评论成功');
                    res.redirect('/list/article.html?id=' + req.query.id);
                }
            });
        });

    } else {
        res.redirect('/user');
    }
});

router.post('/delete', function (req, res) {
    if (req.session.user) {
        console.log(req.session.user);
        var id = req.body.id;
        var uid = req.session.user.uid;
        article_m.deleteReplyById(id,uid,function(result){
            if (result) {
                res.json({
                    code: 0,
                    msg: '删除成功',
                    data: {
                        url: '/home',
                    }
                });
            }
        });
    } else {
        res.redirect('/user');
    }
})

module.exports = router;