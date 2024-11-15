import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true
    },
    postId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    url: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String 
    },
    media: [String],
    author: {
        username: String,
        name: String,
        profileImage: String,
    },
    metrics: {
        likes: Number,
        shares: Number,
        comments: Number,
        views: Number,
    },
}, {timestamps: true});

export const SocialPost = mongoose.model("SocialPost", socialMediaSchema);