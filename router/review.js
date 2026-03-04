const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const Review= require("../modules/reviews.js");
const Listing = require("../modules/listing.js"); 
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController= require("../controllers/review.js");
//review post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.post)
);

//Delete Review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync (reviewController.delete));

module.exports=router;