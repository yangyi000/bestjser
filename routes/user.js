var express = require('express');
var router = express.Router();
var user_m = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.render('index', {
  //   title: 'user',
  //   data:[]
  // }); // 加载index.ejs模板并传递数据给模板
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.redirect('user/login');
  }
});
// 进入到登录页面
router.get('/login', function (req, res, next) {
  res.render('login', {
    errmsg: ''
  });
});
router.get('/reg', function (req, res, next) {
  res.render('reg', {
    errmsg: ''
  }); // 加载reg.ejs模板
});

// post方式
router.post('/reg', function (req, res, next) {
  // 与上面的代码一样
  var username = req.body.username || '',
    password = req.body.password || '',
    password2 = req.body.password2 || '';

  if (password != password2) {
    res.render('reg', {
      errmsg: '密码不一致'
    });
    return;
  }
  var password_hash = user_m.hash(password), // 对密码进行加密
    regtime = parseInt(Date.now() / 1000);

  // 数据库处理
  user_m.reg(username, password_hash, regtime, function (result) {
    if (result.isExisted) {
      res.render('reg', {
        errmsg: '用户名已存在'
      }); // 重新加载注册模板，并提示用户名已存在
    } else if (result.affectedRows) {
      // 注册成功
      req.session.user = {
        uid: result.insertId,
        username: username
      }
      res.redirect('/');
    } else {
      // console.log('登录失败');
      res.render('reg', {
        errmsg: '注册失败，请重新尝试'
      });
    }
  });
});
router.post('/login', function (req, res, next) {
  var username = req.body.username || '',
    password = req.body.password || '';
  console.log(req.body.username)
  var password_hash = user_m.hash(password);

  user_m.login(username, password_hash, function (result) {
    if (result.length) {
      console.log(req.session);
      req.session.user = {
        uid: result[0].id,
        username: username
      }
      res.redirect('/');
      console.log('登录成功');
    } else {
      console.log('登录失败');
      res.render('login', {
        errmsg: '用户名或密码错误'
      });
    }
  });



});

module.exports = router;