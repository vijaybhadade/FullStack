const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema= new schema({
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);//automatically implementing hashing,salting and username ,password

module.exports=mongoose.model("User",userSchema);