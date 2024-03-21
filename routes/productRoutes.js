import express from "express";
import { isAdmin, isAuth } from "../middlewears/authMiddlewear.js";
import {
  addReviewController,
  createProductController,
  deleteProdImgController,
  deleteProductController,
  getAllProductsController,
  getSingleProductController,
  getTopProductController,
  updateProductController,
  updateProductImageController,
} from "../controllers/productController.js";
import { singleUpload } from "../middlewears/multer.js";

const router = express.Router();

// routes
//   Get all products
router.get("/all", getAllProductsController);

// get top product
router.get("/top", getTopProductController);

// get single product with dynamic id
router.get("/:id", getSingleProductController);

// Create product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// update product
router.put("/:id", isAuth, isAdmin, updateProductController);

// update product image
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);

// delete product image
router.delete("/delete_image/:id", isAuth, isAdmin, deleteProdImgController);

// delete product
router.delete("/delete/:id", isAuth, deleteProductController);

// product review
router.put("/:id/review", isAuth, addReviewController);

export default router;
