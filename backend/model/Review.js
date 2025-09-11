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

});

module.exports = mongoose.model('Review', reviewSchema);