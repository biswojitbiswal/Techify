import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    }

}, {timestamps: true})

export const Review = mongoose.model("Review", reviewSchema);