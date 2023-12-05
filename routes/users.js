// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model set up with Mongoose
const Recipe = require('../models/Recipe'); // Assuming you have a Recipe model set up with Mongoose
const passport = require('passport'); // Make sure you have passport configured
const router = express.Router();
// Body parser middleware to parse form data
router.use(express.urlencoded({ extended: true }));


// GET request for the registration page
router.get('/register', (req, res) => {
  res.render('register'); // Render the register.hbs template
});

// GET request for the login page
router.get('/login', (req, res) => {
  res.render('login'); // Render the login.hbs template
});

// POST request for the registration page
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, username, bio, password, confirmPassword } = req.body;

  let errors = [];

  // Check required fields
  if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      username,
      bio,
      password,
      confirmPassword
    });
  } else {
    // Validation passed
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          username,
          bio,
          password,
          confirmPassword
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          firstName,
          lastName,
          email,
          username,
          bio,
          password: hashedPassword
        });

        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
});

// POST request for the login page
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/', // Redirect to the homepage or dashboard after successful login
    failureRedirect: '/users/login', // Redirect back to the login page on failure
    failureFlash: true // Use flash messages to report login failure
  })(req, res, next);
});

// GET request for the logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have logged out');
  res.redirect('/users/login');
});

// GET request for the recipe submission form
router.get('/addRecipe', (req, res) => {
  res.render('addRecipe'); // Render the addRecipe.hbs template
});

module.exports = router;

