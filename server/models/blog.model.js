import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
    },
    blogDescription: {
        type: String,
        required: true,
    },
    blogImg: {
        type: String,
        required: true,
    }
}, {timestamps: true})

export const Blog = mongoose.model("Blog", blogSchema);