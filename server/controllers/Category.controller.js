import { Category } from "../models/category.model.js";

const getAllCategory = async(req, res, next) => {
    try {
        const {fields} = req.query

        let projection = {};
        if(fields === 'minimal'){
            projection = {_id: 1, name: 1};
        }

        const categories = await Category.find({}, projection);

        if(!categories || categories.length === 0){
            return res.status(404).json("No Category Found");
        }

        return res.status(200).json({message: "Categories Fetched", categories})
    } catch (error) {
        next(error);
    }
}

export default getAllCategory