var express = require('express');
var router = express.Router();
var list_m = require('../models/list');

/* GET home page. */
router.get('/', function (req, res, next) {
  var id = req.session.user ? req.session.user.uid : 0;
  var username = req.session.user ? req.session.user.username : '';
  list_m.getIndexList(function (result) {
    res.render('index', {
      data: result,
      userId: id,
      username: username
    }); // 选择index模板并传递数据
  })
});
module.exports = router;