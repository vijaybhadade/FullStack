const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");
const listingController= require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudinaryConfig.js");
const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))   
.post(isLoggedIn,upload.single("listing[image]"),validateListing,  wrapAsync(listingController.create)); 


//New Route
router.get("/new", isLoggedIn,listingController.new);

router.route("/:id")
.get(  wrapAsync(listingController.show)) //show router
.put( validateListing, isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.update))  //update router
.delete( isLoggedIn,isOwner, wrapAsync(listingController.delete)); //delete router




//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.edit));


module.exports = router;