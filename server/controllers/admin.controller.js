import { Product } from "../models/product.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.utils.js";
import { Blog } from "../models/blog.model.js";

const addProducts = async(req, res) => {
    try {
        const {title, description, price} = req.body;

        if([title, description, price].some((field) => field?.trim() === "")){
            return res.status(400).json({message: "All Fields Are Requireds"});
        }

        // console.log(req.files)
        const productImage = req.files?.image[0]?.path;
        // console.log(productImage)

        if(!productImage){
            return res.status(400).json({message: "Image File Is Requireds"})
        }

        const productImageFile = await uploadFileOnCloudinary(productImage);

        if(!productImageFile){
            return res.status(400).json({message: "Image File Is Required"})
        }

        const product = await Product.create({
            title,
            description,
            price,
            image: productImageFile.url
        })

        const createdProduct = await Product.findById(product._id);

        if(!createdProduct){
            return res.status(400).json({ message: "Something Wrong While Adding The Vahicle" });
        }

        return res.status(201).json({
            message: "Product Added Successfully",
            product: createdProduct,
            productId: createdProduct._id,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something Went Wrong"})
    }
}

const editProductDetails = async(req, res) => {
    try {
        const {title, description, price} = req.body;
        const productId = req.params.productId;


        let newImageUrl;
        if (req.files && req.files.image && req.files.image.length > 0) {
            const newImageFile = req.files.image[0].path;
            const newImage = await uploadFileOnCloudinary(newImageFile);
            newImageUrl = newImage.url;
        }

        const editedProduct = await Product.findByIdAndUpdate(
            {_id: productId},
            {
                $set: {
                    title,
                    description,
                    price,
                    ...(newImageUrl && {image: newImageUrl})
                }
            },
            {new: true},
        )

        if(!editedProduct){
            return res.status(400).json({message: "Product Not Found"});
        }

        return res.status(200).json({
            message: "Product Information Updated",
            editData: editedProduct
        });
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

const addBlog = async(req, res) => {
    try {
        const {blogTitle, blogDescription} = req.body;

        if([blogTitle, blogDescription].some((field) => field.trim() === "")){
            return req.status(400).json({message: "All Fields Are Required"})
        }

        const blogImage = req.files?.blogImg[0]?.path
        // console.log(blogImage)
        if(!blogImage){
            return res.status(400).json({message: "File Is Required"})
        }

        const blogImageFile = await uploadFileOnCloudinary(blogImage);

        if(!blogImageFile){
            return res.status(400).json({message: "File Is Required!"})
        }

        const blog = await Blog.create({
            blogTitle,
            blogDescription,
            blogImg: blogImageFile.url
        })

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
    
}

export {
    addProducts,
    editProductDetails,
    addBlog
}