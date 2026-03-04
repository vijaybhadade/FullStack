const User = require("../modules/user.js");

module.exports.signupGet= (req, res) => {
    res.render("users/signup.ejs");
};

 module.exports.signupPost= async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) { return next(err);}
          req.flash("success", "Welcome to Wonderlust!");
        res.redirect("/listings");
        })
    
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.loginGet=  (req, res) => {
       req.flash("success","Now you are successfull login to wonderlust.");
      res.render("users/login.ejs");   
};

module.exports.loginPost= (req, res) => {
        req.flash("success", "Welcome to Wonderlust! You are logged in.");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl); // redirect to listings or home page
    } ;

module.exports.logoutGet=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success"," you are successfully log out");
        res.redirect("/listings");
    });

};