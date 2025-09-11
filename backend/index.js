

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./model/Review');
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


app.post('/',async(req,res)=>{
    try{
        const obj = req.body;
        console.log("Name : ",obj.name);
        console.log("Rating : ",obj.rating);
        const objCreated = await Review.create({
            name: obj.name,
            rating: obj.rating,
        });
        let averageRating = await Review.aggregate([
            { $group: { _id: null, average: { $avg: "$rating" } } }
        ]);

        averageRating = averageRating.length > 0 ? averageRating[0].average : 0;

        if (averageRating < 4) {
            averageRating = (4 + Math.random() * 0.2).toFixed(1);
            averageRating = parseFloat(averageRating);
            averageRating = parseFloat(averageRating.toFixed(2));   }
                            
        res.status(200).json({
                success:"true",
                message : 'Review logged successfully',
                objCreated,
                averageRating,
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:"false",
            message :"Internal Server error",
        })
    }
});



