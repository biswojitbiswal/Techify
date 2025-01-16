import { Product } from "../models/product.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.utils.js";
import { Blog } from "../models/blog.model.js";
import {User} from "../models/user.model.js"
import {Review} from "../models/review.model.js"
import {Order} from "../models/order.model.js"
import mongoose from "mongoose";

const addProducts = async (req, res, next) => {
    try {
        const { title, description, price } = req.body;

        if ([title, description, price].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        const files = req.files?.images;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files provided" });
        }


        const uploadPromises = files.map(file => {
            return uploadFileOnCloudinary(file.path);
        });

        const uploadResults = await Promise.all(uploadPromises);

        const successfulUploads = uploadResults.filter(result => result.success === true);

        if (successfulUploads.length === 0) {
            return res.status(500).json({ message: "File upload failed" });
        }

        const productImages = successfulUploads.map(upload => upload.data.secure_url);



        const product = await Product.create({
            title,
            description,
            price,
            images: productImages,
        });

        const createdProduct = await Product.findById(product._id);

        if (!createdProduct) {
            return res.status(400).json({ message: "Something Went Wrong While Adding The Product" });
        }

        return res.status(201).json({
            message: "Product Added Successfully",
            product: createdProduct,
            productId: createdProduct._id,
        });
    } catch (error) {
        next(error);
    }
};

const editProductDetails = async (req, res, next) => {
    try {
        const { title, description, price } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        let newImageUrls = [];
        if (req.files && req.files.images && req.files.images.length > 0) {
            const imageFiles = req.files.images;

            const uploadPromises = imageFiles.map(file => uploadFileOnCloudinary(file.path));
            const uploadResults = await Promise.all(uploadPromises);

            newImageUrls = uploadResults
                .filter(upload => upload.success === true)
                .map(upload => upload.data.secure_url);
        }

        const updateData = {
            title,
            description,
            price,
        };

        if (newImageUrls.length > 0) {
            updateData.images = newImageUrls;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: productId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(400).json({ message: "Failed to Update Product" });
        }

        return res.status(200).json({
            message: "Product Information Updated",
            editData: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};


const addBlog = async(req, res, next) => {
    try {
        const {blogTitle, blogDescription} = req.body;

        if([blogTitle, blogDescription].some((field) => field.trim() === "")){
            return req.status(400).json({message: "All Fields Are Required"})
        }

        console.log(req.files);
        const blogImage = req.files?.blogImg[0]?.path;
        console.log("Blog Image Path: ", blogImage);
        if (!blogImage) {
        return res.status(400).json({ message: "File Is Required" });
        }



        const blogImageFile = await uploadFileOnCloudinary(blogImage);
        console.log("after cludinary", blogImageFile)
        console.log("after cludinary url", blogImageFile.data.secure_url)


        if(!blogImageFile){
            return res.status(400).json({message: "File Is Required!"})
        }

        const blog = await Blog.create({
            blogTitle,
            blogDescription,
            blogImg: blogImageFile.data.secure_url,
        });

        const addedBlog = await Blog.findById(blog._id)

        if(!addedBlog){
            return res.status(400).json({message: "Something Went Wrong While Adding Blog"})
        }

        return res.status(200).json({
            message: "Blog Added Successfully",
            blog: addedBlog,
            blogId: addedBlog._id
        })
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async(req, res, next) => {
    try {
        const {productId} = req.params

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: "Prduct not found"})
        }

        await User.updateMany(
            {cart: productId},
            {$pull: {cart: productId}},
        )

        await Review.deleteMany({reviewProduct : productId});

        await Product.findByIdAndDelete(productId);

        

        return res.status(200).json({
            message: "Product Removed",
            product,
        })
    } catch (error) {
        next(error);
    }
}

const deleteBlog = async(req, res, next) => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findByIdAndDelete(blogId);

        if(!blog){
            return res.status(404).json({message: "Blog Not Found"})
        }
        return res.status(200).json({
            message : "Blog Removed",
            blog,
        })
    } catch (error) {
        next(error);
    }
}

const getAllusers = async(req, res, next) => {
    try {
        const users = await User.find().select("-password");
    
        if(!users){
            return res.status(404).json({message: "Users Not Found"})
        }
    
        return res.status(200).json({message: "All User Fetched", users});
    } catch (error) {
        next(error);
    }
}

const getUserById = async(req, res, next) => {
    try {
        const {userId} = req.params;

        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        return res.status(200).json({message: "All User Fetched", user});
    } catch (error) {
        next(error);
    }
}

const editUserbyId = async(req, res, next) => {
    try {
        const {name, email, phone} = req.body;
        const {userId} = req.params;

        if(!name || !email || !phone){
            return res.status(400).json({message: "All Field Required"});
        }

        const editUser = await User.findByIdAndUpdate(
            {_id: userId},
            {
                $set: {
                    name,
                    email,
                    phone,
                }
            },
            { new: true, upsert: false, runValidators: true }
        );

        if(!editUser){
            return res.status(404).json({message: "User not found or update failed."})
        }

        return res.status(200).json({message: "User Update Successfully", editUser});
    } catch (error) {
        next(error);
    }
}

const deleteUserById = async(req, res, next) => {
    try {
        const {userId} = req.params;

        const user = await User.findByIdAndDelete(userId);

        if(!user) {
            return res.status(400).json({message: "Something Went Wrong"})
        }

        return res.status(200).json({mesage:"User Deleted Successfully"});
    } catch (error) {
        next(error);
    }
}

const getAllReview = async(req, res, next) => {
    try {
        const reviews = await Review.find({})
        .populate("reviewBy", "name")
        .populate("reviewProduct", "title");

        if(!reviews || reviews.length === 0){
            return res.status(404).json({message: "Reviews Not Found!"});
        }

        return res.status(200).json({message: "Review Fetched Successfully", reviews});
    } catch (error) {
        next(error);
    }
}

const handleStatus = async(req, res, next) => {
    try {
        const {reviewId} = req.params;

        const review = await Review.findById(reviewId)

        if(!review){
            return res.status(404).json({message: "Review Not Found"});
        }


        review.status = review.status === 'Pending' ? 'Approved' : 'Pending',
        await review.save();

        return res.status(200).json({ message: 'Approved!', review });
    } catch (error) {
        next(error);
    }
}

const deleteReviewById = async(req, res, next) => {
    try {
        const {reviewId} = req.params;

        const review = await Review.findByIdAndDelete(reviewId);

        if(!review){
            return res.status(404).json({message: "Review Not Found"});
        }

        const productId = review.reviewProduct;

        await Review.findByIdAndDelete(reviewId);

        const product = await Product.findById(productId);

        if(product){
            product.reviews = product.reviews.filter((id) => id.toString() === reviewId);
            await product.save();
        }

        return res.status(200).json({message: "Review Deleted"})
    } catch (error) {
        next(error);
    }
}

const AccessToRole = async(req, res, next) => {
    try {
        const {userId} = req.params;
        const {role} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({message: `Now, ${user.name} is ${user.role}.`});
    } catch (error) {
        next(error);
    }
}

const getAllOrders = async(req, res, next) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;

        const orders = await Order.find({})
        .populate({
            path: "orderedItem.product",
            select: "title price"
        })
        .populate({
            path: "orderBy",
            select: "name addresses"
        })
        .skip(skip)
        .limit(limit);

        if(!orders || orders.length === 0){
            return res.status(404).json({message : "Order Not Found"});
        }

        const addressWithOrders = orders.map(order => {
            const user = order.orderBy;
            const address = user?.addresses?.find(add => add._id.toString() === order.address.toString());
            return {...order.toObject(), address};
        });

        return res.status(200).json({
            message : "Order Fetched Successfully", 
            orders: addressWithOrders
        });
    } catch (error) {
        next(error);
    }
}

const validOrderStatusTransition = {
    Pending: ['Confirmed', 'Canceled'],
    Confirmed: ['Completed', 'Canceled'],
    Completed: [],
    Cancel: []
}

const isValidStatusTransition = (currentStatus, newStatus) => {
    return validOrderStatusTransition[currentStatus]?.includes(newStatus);
}

const orderStatusUpdate = async(req, res, next) => {
    try {
        const {orderId} = req.params;
        const {newStatus} = req.body;

        // console.log(typeof newStatus);

        if(!newStatus){
            return res.status(400).json({message: "Request Body is Missing"})
        }

        const order = await Order.findById(orderId);
        // console.log(order);

        if(!isValidStatusTransition(order.orderStatus, newStatus)){
            return res.status(400).json({message: "Invalid Status Update"});
        }

        order.orderStatus = newStatus;
        await order.save();

        return res.status(200).json({message: "Order status updated successfully"});
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async(req, res, next) => {
    try {
        const {orderId} = req.params
        // console.log(orderId)
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID" });
        }

        const order = await Order.findByIdAndDelete(orderId);

        if(!order){
            return res.status(404).json({mesage: "Order Not Found"});
        }

        return res.status(200).json({message: "Order Deleted"});
    } catch (error) {
        next(error);
    }
}

const getProductById = async(req, res, next) => {
    try {
        const {productId} = req.params;

        if(!productId){
            return res.status(400).json({message: "Something Went Wrong"});
        }

        const item = await Product.findById(productId).select("-reviews");

        if(!item){
            return res.status(404).json({message: "User Not Found"});
        }

        return res.status(200).json(item);
    } catch (error) {
        next(error);
    }
}

export {
    addProducts,
    editProductDetails,
    addBlog,
    deleteProduct,
    deleteBlog,
    getAllusers,
    getUserById,
    editUserbyId,
    deleteUserById,
    getAllReview,
    handleStatus,
    deleteReviewById,
    AccessToRole,
    getAllOrders,
    orderStatusUpdate,
    deleteOrder,
    getProductById
}




