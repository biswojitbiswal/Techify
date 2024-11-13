import { Product } from "../models/product.model.js";

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({});

        if(!products){
            return res.status(404).json({message: "Products Not Found!"})
        }

        return res.status(200).json({products});
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

export {
    getAllProducts
}