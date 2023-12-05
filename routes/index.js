var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET request for the login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Express' }); // Render the login.hbs template
});




module.exports = router;
