

const express = require('express');
const app = express();

const PORT = 4000;
//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routers
// const addAReviewRouter = require('./routes/addAReview');
app.post('/',async(req,res)=>{
    try{
        const obj = req.body;
        console.log("Name : ",obj.name);
        console.log("Rating : ",obj.rating);
        res.status(200).json({
            success:"true",
            message : 'Review logged successfully',
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:"false",
            message :"Internal Server error",
        })
    }
});



