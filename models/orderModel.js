import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "counb=try is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, " product name is required"],
        },
        price: {
          type: Number,
          required: [true, " product price is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
        },
        image: {
          type: String,
          required: [true, "product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user id is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item Price must be provided"],
    },
    tax: {
      type: Number,
      required: [true, "Tax must be provided"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "Shipping charges must be provided"],
    },
    totalAmount: {
      type: Number,
      required: [true, "total amount must be provided"],
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;
