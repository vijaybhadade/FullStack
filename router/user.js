const express = require("express");
const router = express.Router();

const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user");


// ✅ SIGNUP - GET route  &  ✅ SIGNUP - POST route
router.route("/signup")
.get(userController.signupGet)
.post( wrapAsync(userController.signupPost));

// ✅ LOGIN - GET route && ✅ LOGIN - POST route
router.route("/login")
.get(userController.loginGet)
.post( saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
userController.loginPost
);

//logout-get 
router.get("/logout",userController.logoutGet)
module.exports = router;
