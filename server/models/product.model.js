import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type : String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type:[String],
        required: true,
    },
    stock: {
        type: Number,
        min: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    specification: {
        type: Map,
        of: String,
    },
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        }
    ],
    averageRating: {
        type: Number,
        default: 3,
    },
    
}, {timestamps: true});

export const Product = mongoose.model("Product", productSchema)