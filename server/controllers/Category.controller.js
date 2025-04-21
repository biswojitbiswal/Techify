import mongoose, { get } from "mongoose";
import { Category } from "../models/category.model.js";
import {Product} from '../models/product.model.js'

const getAllCategory = async(req, res, next) => {
    try {
        const categories = await Category.find({});

        if(!categories || categories.length === 0){
            return res.status(404).json("No Category Found");
        }

        return res.status(200).json({message: "Categories Fetched", categories})
    } catch (error) {
        next(error);
    }
}

const getProductByCategoryAndBrand = async(req, res, next) => {
    try {

        const { categoryId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).json({message: "Invalid Category ID"});
        }

        let query = { category: categoryId };

        const products = await Product.find(query);
        
        if(!products || products.length === 0){
            return res.status(404).json({
                message: "Products Not Found", 
                products: []
            });
        }

        return res.status(200).json({
            message: "Products found successfully",
            products: products
        });
    } catch (error) {
        next(error);
    }
}

export {
    getAllCategory,
    getProductByCategoryAndBrand
} 