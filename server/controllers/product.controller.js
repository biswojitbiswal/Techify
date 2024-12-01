import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({})
        .populate({
            path: "reviews",
            populate: {
                path: "reviewBy",
                select: "name",
            }
        })
        

        if(!products){
            return res.status(404).json({message: "Products Not Found!"})
        }

        return res.status(200).json({products});
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const addToCart = async(req, res) => {
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
        console.log(error)
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const removeItemCart = async(req, res) => {
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
        console.log(error)
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

export {
    getAllProducts,
    addToCart,
    removeItemCart,
}