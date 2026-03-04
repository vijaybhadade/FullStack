const Listing= require("./modules/listing.js");
const Review= require("./modules/reviews.js");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema");

module.exports.isLoggedIn=(req,res,next)=>
{
  console.log(req.path , "...",);
  if(!req.isAuthenticated())
    {    
        req.session.redirectUrl=req.originalUrl;
         req.flash("error"," you must be  login for access wonderlust website");
        return  res.redirect("/login");
    }
    next();
};

//redirect middleware 
module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl)
{
  res.locals.redirectUrl=req.session.redirectUrl;
}
next();
};


//middleware for authorization for listings
module.exports.isOwner=async(req,res,next)=>
{
   let { id } = req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id))
  {
    req.flash("error"," You are not owner of this listings");
    return res.redirect(`/listings/${id}`); 
  }
  next();
};


//validation  schema for listings 
module.exports.validateListing = (req, res, next) => {
  const { value, error } = listingSchema.validate(req.body);

  if (error) {

    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    req.validatedBody = value;
    next();
  }

};

//validation schema for review
module.exports.validateReview = (req, res, next) => {
  const { value, error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    req.validatedBody = value; // validated review data
    next();
  }
};


// to check aouthor or not 
module.exports.isReviewAuthor= async(req,res,next)=>
{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id))
  {
    req.flash("error"," You did not create this review");
    return  res.redirect(`/listings/${id}`);
  }
  next();
}