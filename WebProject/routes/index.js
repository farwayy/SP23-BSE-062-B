const express = require('express');
const router = express.Router();

// Route for homepage
router.get('/', (req, res) => {
  res.render('pages/homepage'); // Renders homepage.ejs
});

// Route for bags page
router.get('/bags', (req, res) => {
  //res.render('pages/bags'); // Renders bags.ejs
  res.redirect('/products?category=bags');
});

module.exports = router;
