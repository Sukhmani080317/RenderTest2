// models/Recipe.js

const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{
        name: { type: String, required: true },
        quantity: { type: String, required: true }
    }],
    instructions: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
