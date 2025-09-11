const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Review schema
const reviewSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 
    },
    user_rating_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }

});

module.exports = mongoose.model('Review', reviewSchema);