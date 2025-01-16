import { Product } from "../models/product.model.js";
import {Review} from "../models/review.model.js";

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



export {
    addReview
}