import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import {Review} from "../models/review.model.js";
import { Order } from "../models/order.model.js";

const addReview = async(req, res, next) => {
    try {
        const {productId} = req.params;
        const {rating, comment} = req.body;
        const userId = req.userId;

        if(!rating){
            return res.status(400).json({message: "Plz Give A Rating!"})
        }

        const newReview = await Review.create({
            reviewBy: userId,
            reviewProduct: productId,
            rating,
            comment,
        })

        if(!newReview){
            return res.status(500).json({message: "Something went Wrong!"});
        }

        const product = await Product.findById(productId).populate('reviews');

        if(!product){
            return res.status(404).json({message: "Product Not Found"})
        }

        product.reviews.push(newReview._id);

        let totalRatings = 0;
        for(const reviewId of product.reviews){
            const review = await Review.findById(reviewId);
            totalRatings += review.rating;
        }

        const totalReviews = product.reviews.length;
        const avgRating = totalRatings / totalReviews;

        product.averageRating = avgRating;
        await product.save();

        return res.status(200).json({message: "Review Added Successfully"});
    } catch (error) {
        next(error);
    }
}

const checkOrdesForReview = async(req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id;
        // console.log(productId)
        // console.log(userId)

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid User ID or Product ID" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const alreadyOrdered = await Order.aggregate([
            {
                $match: {
                    orderBy: userObjectId,
                    "orderedItem.product": productObjectId
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ])
        // console.log(alreadyOrdered);

        if(alreadyOrdered.length === 0){
            return res.status(400).json({message: "Sorry!, You haven't Purchased This Product"})
        }

        return res.status(200).json(alreadyOrdered);
    } catch (error) {
        next(error);
    }
}

const getAllReviews = async(req, res, next) => {
    try {
        const {productId} = req.params;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({message: "Invalid Product Id"});
        }

        const reviews = await Review.find({reviewProduct: productId})
        .populate("reviewBy", "name");

        if(!reviews || reviews.length === 0){
            return res.status(404).json({message: "Reviews Not Found"});
        }

        return res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}

export {
    addReview,
    getAllReviews,
    checkOrdesForReview
}