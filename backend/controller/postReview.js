const Review = require("../model/Review.js");

exports.postReview = async (req, res) => {
  try {
    const obj = req.body;
    // Check if user_rating_id already exists
    const existingReview = await Review.findOne({ user_rating_id: obj.user_rating_id });
    if (existingReview) {
      return res.status(403).json({
        success: "false",
        message: "You have already rated this website."
      });
    }
    // Create new review
    const objCreated = await Review.create({
      name: obj.name,
      rating: obj.rating,
      user_rating_id: obj.user_rating_id
    });
    let SDCREVIEWVARIABLE = await Review.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);
    SDCREVIEWVARIABLE = SDCREVIEWVARIABLE.length > 0 ? SDCREVIEWVARIABLE[0].average : 0;
    if (SDCREVIEWVARIABLE < 4) {
      SDCREVIEWVARIABLE = (4 + Math.random() * 0.2).toFixed(1);
      SDCREVIEWVARIABLE = parseFloat(SDCREVIEWVARIABLE);
      SDCREVIEWVARIABLE = parseFloat(SDCREVIEWVARIABLE.toFixed(2));
    }
    console.log("Name : ", obj.name);
    console.log("Rating : ", obj.rating);
    res.status(200).json({
      success: "true",
      message: "Review logged successfully",
      objCreated,
      SDCREVIEWVARIABLE,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: "false",
      message: "Internal Server error",
    });
  }
};
