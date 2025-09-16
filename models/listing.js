const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Import the Review model

const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  description: {
    type: String,
    required: true, // Description is required
  },
  image: {
    filename: {
      type: String,
      default: "defaultimage", // Default filename if no image is uploaded
    },
    url: {
      type: String,
      default:
        "https://img.freepik.com/premium-photo/modern-midcentury-home-exterior-design-elements_1123896-139010.jpg", // Default image URL
    },
  },
  price: {
    type: Number,
    required: true, // Price is required
    min: 0, // Price must be a positive number
  },
  location: {
    type: String,
    required: true, // Location is required
  },
  country: {
    type: String,
    required: true, // Country is required
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // Owner is required
  },
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews, // Delete all reviews associated with the listing
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
