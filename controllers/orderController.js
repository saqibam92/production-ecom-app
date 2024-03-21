import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

// Order COntrollers
// Create Order
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    // validation
    // if (
    //   !shippingInfo ||
    //   !orderItems ||
    //   !itemPrice ||
    //   !tax ||
    //   !shippingCharges ||
    //   !totalAmount
    // ) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "missing data",
    //   });
    // }

    // Create order
    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;

      // save the updated product
      await product.save();
    }

    // send email to admin and customer

    // response
    res.status(201).send({
      success: true,
      message: "New order is created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create order api",
      error,
    });
  }
};

// get all aorders- my orders
export const getMyOrderesController = async (req, res) => {
  try {
    // get find order
    const orders = await orderModel.find({ user: req.user._id });
    // validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "No Order Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "your order data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get my orders api",
      error,
    });
  }
};
// get single order info
export const getSingleOrderInfoController = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findById(req.params.id);
    // validation if  not found
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "no order found",
      });
    }
    res.status(200).send({
      success: true,
      message: `the information of the order is as follows`,
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: `Invalid id . ${Object.keys(error.path)}`,
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get my order api",
      error,
    });
  }
};

// accept payment
export const acceptPaymentController = async (req, res) => {
  try {
    // get total amount
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "total amount is required",
      });
    }
    // let order = await orderModel.findByIdAndUpdate(req.params.id ,{isPaid  :true}, {new : true});

    // check if paid amount is equal to total amount or not
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });

    res.status(201).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get my order api",
      error,
    });
  }
};

// ===========admin section======================

//  admin view all orders
export const adminViewAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find();

    res.status(200).send({
      success: true,
      message: " all orders data",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get my order api",
      error,
    });
  }
};

//  update the status of an order by admin
export const updateOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    // validation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "order not found",
      });
    }

    if (order.orderStatus === "Pending") order.orderStatus = "Processing";
    else if (order.orderStatus === "Processing") order.orderStatus = "Shipped";
    else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "Order Status  is already Delivered",
      });
    }
    await order.save();
    res.status(201).send({
      success: true,
      message: `the order ${order._id} has been updated successfully`,
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: `Invalid id . ${Object.keys(error.path)}`,
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get my order api",
      error,
    });
  }
};
