import { User } from "../models/user.model.js";

const addRecentlyView = async(req, res, next) => {
    try {
        const userId = req.userId;
        const {productId} = req.params;

        if(!userId || !productId){
            return next();
        }

        const user = await User.findById(userId);

        if(!user){
            return next();
        }

        user.recentlyView = user.recentlyView.filter((id) => id.toString() !== productId);

        user.recentlyView.unshift(productId);

        if(user.recentlyView.length > 10){
            user.recentlyView.pop();
        }

        await user.save();

        // console.log("Middleware executed successfully")
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export default addRecentlyView;