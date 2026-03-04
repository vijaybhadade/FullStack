const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title:  String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number, 
  location: String,
  country: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  category:{
   type:String,
   enum:["moutain","artic","farms","deserts"],
  }
});

module.exports = mongoose.model("Listing", listingSchema);