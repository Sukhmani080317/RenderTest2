// routes/recipeRoutes.js

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Import the Recipe model

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/users/login');
}

// GET request to show all recipes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all recipes from the database
        res.render('recipeList', { recipes }); // Render recipeList.hbs template with recipes data
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err });
    }
});

// Apply the middleware to the recipe submission routes
router.get('/addRecipe', ensureAuthenticated, (req, res) => {
    res.render('addRecipe');
});

// POST route to handle recipe submission
router.post('/addRecipe', ensureAuthenticated, async (req, res) => {
    try {
        const { title, description, ingredients, instructions } = req.body;

        // Validate the input
        if (!title || !description || !ingredients || !instructions) {
            req.flash('error_msg', 'Please fill in all the fields.');
            return res.redirect('/addRecipe');
        }

        const ingredientsArray = ingredients.split('\n').map(ingredient => {
            return { name: ingredient.trim(), quantity: '' }; // Modify as needed
        });

        // Create a new recipe instance
        const newRecipe = new Recipe({
            title,
            description,
            ingredients: ingredientsArray,
            instructions,
            user: req.user._id // Ensure the user is authenticated
        });

        // Save the recipe to the database
        await newRecipe.save();
        req.flash('success_msg', 'Recipe added successfully!');
        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
