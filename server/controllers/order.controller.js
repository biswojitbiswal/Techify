import mongoose from "mongoose";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createOrder = async (req, res, next) => {
  try {
    const { name, contact, orderedItem, addressId, totalAmount } = req.body;

    if (
      !name ||
      !contact ||
      orderedItem.length === 0 ||
      !addressId ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const options = {
      amount: totalAmount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res
        .status(500)
        .json({ message: "Could not create Razorpay order." });
    }

    const order = await Order.create({
      orderBy: req.userId,
      name,
      contact,
      orderedItem,
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
    next(error);
  }
};

const verifyOrderPayment = async (req, res, next) => {
  try {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters.",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");


    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findOne({ orderId: razorpay_order_id });

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found",
        });
      }

      const updatedOrder = await Order.updateOne(
        { orderId: razorpay_order_id },
        {
          $set: {
            paymentId: razorpay_payment_id,
            paymentSignature: razorpay_signature,
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
          },
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
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderBy: req.userId })
      .populate({
        path: 'orderBy',
        select: 'name phone addresses',
      })
      .populate({
        path: 'orderedItem.product',
        select: 'title description price images',
      });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order Not Found' });
    }

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      cancellationReason: order.cancellationReason,
      address: order.address,
      orderedItem: order.orderedItem.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        title: item.product.title,
        price: item.product.price,
        image: item.product.images[0],
      })),
      userDetails: {
        name: order.orderBy.name,
        phone: order.orderBy.phone,
        addresses: order.orderBy.addresses,
      },
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async(req, res, next) => {
  try {
    const {orderId} = req.params;
    const {reason} = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({message: "Something Wrong"});
    }

    if(!reason){
      return res.status(400).json({message: "Reason Required"})
    }

    const order = await Order.findById(orderId);

    if(!order){
      return res.status(404).json({message: "Order Not Found"});
    }

    if(order.orderStatus === 'Completed'){
      return res.status(400).json({message: "Can't Cancel!, Too Late"})
    }

    await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          cancellationReason: reason,
          orderStatus: "Canceled",
          paymentStatus: "Refunded",
        }
      },
      {new: true}
    )

    return res.status(200).json({message: "Order Canceled"})
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export { createOrder, verifyOrderPayment, getUserOrders, cancelOrder };
