if(process.env.NODE_EVN != "production")
{
require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-Mate");
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./modules/user.js");
const passport=require("passport");
const LocalPassport= require("passport-local");
const userRouter=require("./router/user.js");
const listingRouter=require("./router/listing.js");
const reviewRouter=require("./router/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//this is sessionOptions 
const sessionOption={
  secret:"mysupercode",
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now()+3*24*60*60*1000,
    maxAge:3*24*60*60*1000,
    httpOnly: true
  }
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public/"))); 
app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use(express.json());
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", wrapAsync((req, res) => {
  res.redirect("/listings");
}));

//middleware for flash
app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;

next();
});


//Router for listings
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//create demo user
// app.get("/demouser", async(req,res)=>{
//   let fakeUser= new User({
//     email:"user23@gmail.com",
//     username: "user23434"
//   });
//  let newUser= await User.register(fakeUser,"user@3234234");
//  res.send(newUser);
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
//Middleware handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    console.log("Headers already sent! Skipping error handler.");
    return next(err);
  }
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("Error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
}); 