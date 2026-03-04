const Listing = require("../modules/listing.js");
const Review= require("../modules/reviews.js");

module.exports.post=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    const newReview = new Review(req.validatedBody.review); // use validatedBody
    newReview.author=req.user._id;
    console.log(newReview);
    await newReview.save();

    listing.reviews.push(newReview._id); // push only the review _id
    await listing.save();
    req.flash("success"," Reviews created...");
    res.redirect(`/listings/${listing._id}`);
  };


module.exports.delete=async (req,res)=>{
let {id,reviewId}= req.params;
await Listing.findByIdAndUpdate(id,{$pull: { reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success"," Reviews deleted...");
res.redirect(`/listings/${id}`);
};