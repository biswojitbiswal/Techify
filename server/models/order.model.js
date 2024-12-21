import mongoose, { Schema } from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    orderedItem: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }, 
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    paymentSignature: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ["Pending","Confirmed", "Completed", "Canceled"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    }
    // paymentMethod, paymentFailureReason, statusHistory
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);