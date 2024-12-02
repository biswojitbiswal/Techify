import mongoose from "mongoose";
import crypto from "crypto";
import { Order } from "../models/order.model.js"; // Ensure this path points to your Order model file
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { name, contact, quantity, addressId, totalAmount, productId } =
      req.body;

    // Validate inputs
    if (
      !name ||
      !contact ||
      !quantity ||
      !addressId ||
      !totalAmount ||
      !productId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prepare Razorpay order options
    const options = {
      amount: totalAmount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res
        .status(500)
        .json({ message: "Could not create Razorpay order." });
    }

    // Save the order in the database
    const order = await Order.create({
      orderBy: req.userId,
      name,
      contact,
      orderedItem: productId,
      quantity,
      address: addressId,
      totalAmount,
      orderId: razorpayOrder.id,
    });

    if (!order) {
      return res.status(400).json({ message: "Order creation failed." });
    }

    return res.status(200).json({
      success: true,
      message: "Order created successfully.",
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyOrderPayment = async (req, res) => {
  try {
    // Log the entire request body to verify incoming data
    console.log("Request Body:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check for missing parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters."
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Log for debugging
    console.log("Razorpay Order ID:", razorpay_order_id);
    console.log("Razorpay Payment ID:", razorpay_payment_id);
    console.log("Expected Signature:", expectedSign);
    console.log("Received Signature:", razorpay_signature);

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Check if the order exists
      const order = await Order.findOne({ orderId: razorpay_order_id });

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found",
        });
      }

      // Update the order with payment details
      const updatedOrder = await Order.updateOne(
        { orderId: razorpay_order_id }, 
        {
          $set: {
            paymentId: razorpay_payment_id,
            paymentSignature: razorpay_signature,
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
          }
        }
      );

      if (updatedOrder.nModified === 0) {
        return res.status(400).json({
          success: false,
          message: "Booking not found or already updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order Confirmed",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};


// const getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ orderBy: req.userId })
//       .populate('orderedItem')
//       .populate('address');

//     if (!orders) {
//       return res.status(404).json({ message: "No orders found." });
//     }

//     return res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return res.status(500).json({ message: "Internal Server Error." });
//   }
// };

export { createOrder, verifyOrderPayment };
