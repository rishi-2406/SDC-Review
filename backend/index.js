const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./model/Review');
const { postReview } = require('./controller/postReview');
const app = express();

const PORT = 4000;


//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//connecting to the database 

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



