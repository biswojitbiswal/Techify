import mongoose, { Schema } from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type:String,
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }]
}, {timestamps: true});

export const Brand = mongoose.model("Brand", brandSchema);