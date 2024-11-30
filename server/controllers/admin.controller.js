import { Product } from "../models/product.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.utils.js";
import { Blog } from "../models/blog.model.js";
import {User} from "../models/user.model.js"
import {Review} from "../models/review.model.js"

const addProducts = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if ([title, description, price].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        const files = req.files?.images;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files provided" });
        }

        console.log("Uploaded Files:", files);

        const uploadPromises = files.map(file => {
            console.log("Uploading File Path:", file.path);
            return uploadFileOnCloudinary(file.path);
        });

        const uploadResults = await Promise.all(uploadPromises);

        console.log("Cloudinary Upload Results:", uploadResults);

        const successfulUploads = uploadResults.filter(result => result.success === true);

        if (successfulUploads.length === 0) {
            return res.status(500).json({ message: "File upload failed" });
        }

        const productImages = successfulUploads.map(upload => upload.data.secure_url);
        console.log("Product Images URLs:", productImages);



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
        console.error("Error in addProducts:", error);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
};



const editProductDetails = async (req, res) => {
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
        console.error("Error in editProductDetails:", error);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};


const addBlog = async(req, res) => {
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
            blogImg: blogImageFile.data.secure_url, // Make sure this is not undefined
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
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong", error})
    }
}

const deleteProduct = async(req, res) => {
    try {
        const {productId} = req.params
    
        const product = await Product.findByIdAndDelete(productId)
        
        if(!product){
            return res.status(404).json({message: "Prduct Not Found"});
        }

        return res.status(200).json({
            message: "Product Removed",
            product,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const deleteBlog = async(req, res) => {
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
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const getAllusers = async(req, res) => {
    try {
        const users = await User.find().select("-password");
    
        if(!users){
            return res.status(404).json({message: "Users Not Found"})
        }
    
        return res.status(200).json({message: "All User Fetched", users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const getUserById = async(req, res) => {
    try {
        const {userId} = req.params;

        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        return res.status(200).json({message: "All User Fetched", user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const editUserbyId = async(req, res) => {
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
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const deleteUserById = async(req, res) => {
    try {
        const {userId} = req.params;

        const user = await User.findByIdAndDelete(userId);

        if(!user) {
            return res.status(400).json({message: "Something Went Wrong"})
        }

        return res.status(200).json({mesage:"User Deleted Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const getAllReview = async(req, res) => {
    try {
        const reviews = await Review.find({})
        .populate("reviewBy", "name")
        .populate("reviewProduct", "title");

        if(!reviews || reviews.length === 0){
            return res.status(404).json({message: "Reviews Not Found!"});
        }

        return res.status(200).json({message: "Review Fetched Successfully", reviews});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

const handleStatus = async(req, res) => {
    try {
        const {reviewId} = req.params;

        const review = await Review.findById(reviewId)

        if(!review){
            return res.status(404).json({message: "Review Not Found"});
        }

        if (review.status === 'Approved') {
            return res.status(400).json({ message: 'Review is already approved!' });
        } 

        review.status = 'Approved',
        await review.save();

        return res.status(200).json({ message: 'Approved!', review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong!"})
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
    handleStatus
}