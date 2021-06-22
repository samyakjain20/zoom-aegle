var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('webinars', { title: 'All Webinars' });
});

router.get('/webinars', function(req, res, next) {
  res.render('webinars', { title: 'All Webinars' });
});

router.get('/createWeb', function(req, res, next) {
  res.render('createWeb', { title: 'Create Webinars' });
});

router.get('/schedule', function(req, res, next) {
  res.render('appointments', { title: 'Appointments' });
});

module.exports = router;