const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./model/Review');
const { postReview } = require('./controller/postReview');
const app = express();

const PORT = 4000;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

app.use(express.json());

app.post('/', postReview);

app.get('/overall-average', async (req, res) => {
    try {
        let result = await Review.aggregate([
            { $group: { _id: null, average: { $avg: "$average" } } },
        ]);
        const overallAverage = result.length > 0 ? result[0].average : 0;
        res.json({ overallAverage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch overall average.' });
    }
});

app.get('/check-rated', async (req, res) => {
    const user_rating_id = req.query.user_rating_id;
    if (!user_rating_id) {
        return res.status(400).json({ hasRated: false });
    }
    try {
        const review = await Review.findOne({ user_rating_id });
        res.json({ hasRated: !!review });
    } catch (err) {
        res.status(500).json({ hasRated: false });
    }
});



