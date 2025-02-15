import mongoose, { Schema } from "mongoose";
import { type } from "os";

const orderSchema = new mongoose.Schema(
  {
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    orderedItem: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Completed", "Canceled"],
          default: "Confirmed",
        },
        cancellationReason: {
          type: String,
          default: "null",
        },
        payStatus: {
          type: String,
          enum: ["Pending", "Paid", "Failed", "Refunded"],
          default: "Pending",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentSignature: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    // paymentMethod, paymentFailureReason, statusHistory
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
