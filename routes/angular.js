var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('angular/index');
});
router.get('/*', function (req, res, next) {
  res.redirect('/angular');
});
module.exports = router;