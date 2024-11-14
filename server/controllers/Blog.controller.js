import { Blog } from "../models/blog.model.js";

const getAllBlogs = async(req, res) => {
    try {
        const blogs = await Blog.find({});

        if(!blogs){
            return res.status(400).json({message: "Blogs Not Found"})
        }

        return res.status(200).json({blogs})
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong"})
    }
}

export {getAllBlogs}