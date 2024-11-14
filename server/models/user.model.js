import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Product} from "./product.model.js"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    }
},{timestamps: true});

userSchema.pre("save", async function(next) {
    if(!this.isModified) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            isAdmin: this.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}


export const User = mongoose.model("User", userSchema);