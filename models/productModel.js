import mongoose from "mongoose";

// review model
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "user id is required"],
    },
  },
  { timestamps: true }
);

// Product Model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    description: {
      type: String,
      required: [true, "product description  is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    stock: {
      type: String,
      required: [true, "product stock is required"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Static method to get all products in the database
// productSchema.statics.getAllProducts = async function () {
//     return await this.find().sort('-createdAt'); // sort by date in descending order
// }

// // Method to add a review and update the number of reviews and rating for a product
// productSchema.methods.addReview = async function (review) {
//     const updatedProduct = await this.updateOne({
//         reviews: this.reviews.concat(review),
//         numOfReviews: this.numOfReviews + 1,
//         totalRating: this.totalRating + review.rating
//     });
//     console.log(updatedProduct);
// };

// module.exports = mongoose.model("Product", productSchema);

export const productModel = mongoose.model("Products", productSchema);
export default productModel;
