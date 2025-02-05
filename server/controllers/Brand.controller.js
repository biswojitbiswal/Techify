import {Brand} from '../models/brand.model.js'

const getAllBrand = async(req, res, next) => {
    try {
        const brands = await Brand.find({}).select("-categories -description -logo");

        if(!brands || brands.length === 0){
            return res.status(404).json({message: "No More Product Found"});
        }

        return res.status(200).json(brands);
    } catch (error) {
        next(error)
    }
}

export {getAllBrand}