const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage }); // Configure multer to use Cloudinary storage

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Display all listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // Handle file upload
    wrapAsync(async (req, res, next) => {
      try {
        console.log("Request Body:", req.body); // Debugging: Log the request body
        console.log("Uploaded File:", req.file); // Debugging: Log the uploaded file

        if (!req.body.listing) {
          console.error("Error: Listing data is missing in the request body.");
        }

        if (!req.file) {
          console.error("Error: File upload failed or no file provided.");
        }

        const listing = new Listing(req.body.listing);

        // Handle image upload or set default image
        if (req.file) {
          listing.image = { url: req.file.path, filename: req.file.filename }; // Save uploaded file info
        } else {
          listing.image = {
            url: "https://img.freepik.com/premium-photo/modern-midcentury-home-exterior-design-elements_1123896-139010.jpg",
            filename: "defaultimage",
          }; // Set default image
        }

        listing.owner = req.user._id; // Associate the listing with the logged-in user
        await listing.save();

        console.log("Listing Created:", listing); // Debugging: Log the created listing
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings"); // Redirect to the "All Listings" page
      } catch (err) {
        console.error("Error Creating Listing:", err); // Debugging: Log the error
        next(err);
      }
    })
  );

// Route to render the form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for a specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show a specific listing
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing) // Update a specific listing
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing) // Delete a specific listing
  );

// Route to render the form for editing a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
