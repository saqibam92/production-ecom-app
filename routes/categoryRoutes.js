import express from "express";
import { isAuth } from "../middlewears/authMiddlewear.js";
import { singleUpload } from "../middlewears/multer.js";
import {
  creatCategory,
  deletCatController,
  getAllCat,
  updateCatController,
} from "../controllers/categoryController.js";

const router = express.Router();

// routes
// create category
router.post("/create", isAuth, creatCategory);
// get all category
router.get("/all", getAllCat);
// delete category
router.delete("/delete/:id", isAuth, deletCatController);
// update category
router.put("/update/:id", isAuth, updateCatController);

export default router;
