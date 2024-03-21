import express from "express";
import { isAdmin, isAuth } from "../middlewears/authMiddlewear.js";
import { singleUpload } from "../middlewears/multer.js";
import {
  acceptPaymentController,
  adminViewAllOrdersController,
  createOrderController,
  getMyOrderesController,
  getSingleOrderInfoController,
  updateOrderStatusController,
} from "../controllers/orderController.js";

const router = express.Router();

// routes

// create order
router.post("/create", isAuth, createOrderController);

// create order
router.get("/my_orders", isAuth, getMyOrderesController);

// create order
router.get("/my_orders/:id", isAuth, getSingleOrderInfoController);

// create order
router.post("/payments", isAuth, acceptPaymentController);

// ============Admin part =================
router.get(
  "/admin/get_all_orders",
  isAuth,
  isAdmin,
  adminViewAllOrdersController
);

// cahnge order status
router.put("/admin/order/:id", isAuth, isAdmin, updateOrderStatusController);

export default router;
