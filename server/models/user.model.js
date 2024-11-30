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
    addresses: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: () => new mongoose.Schema.Types.ObjectId()
            },
            type: {
                type: String,
                enum: ['Home', 'Work', 'Other'],
                default: 'Home',
            },
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            zipcode: {
                type: String,
            }
        }
    ],
    role: {
        type: String,
        enum: ['User', 'Moderator', 'Admin'],
        default: 'User',
    }
},{timestamps: true});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    const result = await bcrypt.compare(password, this.password);
    console.log("Password comparison result:", result); // Debugging log
    return result;
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