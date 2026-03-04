const Listing = require("../modules/listing.js");
const axios = require("axios");

// ============================
// 🌍 Geocoding Function
// ============================


async function getCoordinates(location) {
  try {
    if (!location || location.trim() === "") {
      throw new Error("Location is empty");
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "my-listing-app",
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("No coordinates found for this location");
    }

    const lon = parseFloat(response.data[0].lon);
    const lat = parseFloat(response.data[0].lat);

    if (isNaN(lon) || isNaN(lat)) {
      throw new Error("Invalid coordinates received from API");
    }

    return [lon, lat]; // Mongo expects [longitude, latitude]
    
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    throw error; // stop listing creation if location fails
  }
}

// ============================
// 📌 INDEX ROUTE
// ============================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ============================
// 📌 SHOW ROUTE
// ============================
module.exports.show = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// ============================
// 📌 NEW ROUTE
// ============================
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// ============================
// 📌 CREATE ROUTE
// ============================
module.exports.create = async (req, res) => {
  try {
    const { location } = req.body.listing;


    // Get coordinates from OpenStreetMap
    const coords = await getCoordinates(location);
    console.log(" Coordinates received:",coords);

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);



    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = {
      type: "Point",
      coordinates: coords, // [lon, lat]
    };

    await newListing.save();

    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings");
  }
};
     

  

// ============================
// 📌 EDIT ROUTE
// ============================
module.exports.edit = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/c_fill,h_300,w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ============================
// 📌 UPDATE ROUTE
// ============================
module.exports.update = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// ============================
// 📌 DELETE ROUTE
// ============================
module.exports.delete = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};