import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const getAllProducts = async(req, res, next) => {
    try {
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);

        const products = await Product.find({})
        .select("-reviews")
        .skip(skip)
        .limit(limit);
        

        if(!products || products.length === 0){
            return res.status(404).json({message: "Products Not Found!"})
        }

        return res.status(200).json({Allproducts : products});
    } catch (error) {
        next(error);
    }
}

const addToCart = async(req, res, next) => {
    try {
        const userId = req.userId
        const {productId} = req.params

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message : "Product Not Found"});
        }

        if(user.cart.includes(productId)){
            return res.status(400).json({message: "Item Already In Your Cart"});
        }

        user.cart.push(productId);
        await user.save();

        // console.log(user.cart);
        return res.status(200).json({
            message: "Added To Your Cart",
            cart: user.cart,
        })
    } catch (error) {
        next(error);
    }
}

const removeItemCart = async(req, res, next) => {
    try {
        const {productId} = req.params
        const userId = req.userId

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    cart: productId
                }
            },
            {new: true}
        ).select("-password")

        if(!user){
            return res.status(404).json({ message: "User not found!" });
        }

        return res.status(200).json({
            message: "Item removed from cart", 
            user 
        });
    } catch (error) {
        next(error);
    }
}

const getCartItem = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid or missing User ID" });
        }

        const user = await User.findById(userId).populate('cart').select("cart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        return res.status(200).json({ cart: user.cart });
    } catch (error) {
        next(error);
    }
};


const prosuctShowCase = async(req, res, next) => {
    try {
        const products = await Product.find({}).limit(10);

        if(!products){
            return res.status(404).json({message: "Product Not Found"});
        }

        return res.status(200).json({showcase: products});
    } catch (error) {
        next(error);
    }
}

const getProductById = async(req, res, next) => {
    try {
        const {productId} = req.params;
        // console.log(productId);

        const product = await Product.findById(productId)
        .populate({
            path: "reviews",
            populate: {
                path: "reviewBy",
                select: "name",
            }
        });

        if(!product){
            return res.status(404).json({message: "Product Not Found"});
        }

        return res.status(200).json({item: product});
    } catch (error) {
        next(error);
    }
}

const getOrderItem = async(req, res, next) => {
    try {
        const {productIds} = req.body;
        // console.log(productIds);

        if (!Array.isArray(productIds) || !productIds.length) {
            return res.status(400).json({ message: "Invalid input: productIds should be a non-empty array" });
        }

        const itemIds = productIds.map((id) => new mongoose.Types.ObjectId(id));

        const orders = await Product.find({_id: {$in: itemIds}}).select("-reviews");

        if(!orders || orders.length === 0){
            return res.status(404).json({message: "Not Found"});
        }

        return res.status(200).json({orders})
    } catch (error) {
        next(error);
    }
}

export {
    getAllProducts,
    addToCart,
    removeItemCart,
    getCartItem,
    prosuctShowCase,
    getProductById,
    getOrderItem
}