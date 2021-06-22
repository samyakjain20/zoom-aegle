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

<<<<<<< HEAD
router.get('/schedule', function(req, res, next) {
  res.render('appointments', { title: 'Appointments' });
});
=======
>>>>>>> e638cae6f592533c821232ed27ee35c7dcf2b095

module.exports = router;