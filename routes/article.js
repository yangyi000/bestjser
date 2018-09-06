var express = require('express');
var router = express.Router();
var article_m = require('../models/article');
var async = require("async");
var editId = null;
router.get('/edit', function (req, res) {
    
    if (req.session.user) {
        var id = req.query.id; 
        if(id){ // 有ID则为编辑
            editId = id;
            article_m.getListById(id, function (result) {
                // res.json(results);
                var uid = req.session.user ? req.session.user.uid : 0;
                if (uid === result[0].uid) {// 验证该文章作者是否与当前登录用户匹配。Y:正常编辑；N:跳转新建文章
                    res.render('article', {
                        data: result,
                        userId: id,
                        username: req.session.user.username,
                    });
                }else{
                    res.redirect('edit');
                }
            });  
        }else{ // 没有id为新建
            res.render('article', {
                data: '',
                username: req.session.user.username,
                userId: req.session.user.uid
            });
        }
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
router.post('/update', function (req, res) {
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
        if (editId) {
            var id = editId; 
            article_m.updateListById(editId,params, function (result) {
                // res.json(results);
                editId = null;// 重置文章编辑ID
                res.json({
                    data: result,
                    id:id,
                    userId: req.session.user.uid,
                    username: req.session.user.username,
                });
            });  
        }
    } else {
        res.redirect('/user');
    }
});

module.exports = router;