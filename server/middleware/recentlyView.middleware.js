import { User } from "../models/user.model.js";

const addRecentlyView = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    if (!productId) {
        return next();
    }
    // console.log(productId)

    console.log(userId)
    if (userId) {
      const user = await User.findById(userId);

      if (user) {
        user.recentlyView = user.recentlyView.filter(
          (id) => id.toString() !== productId
        );
        user.recentlyView.unshift(productId);

        if (user.recentlyView.length > 12) {
          user.recentlyView.pop();
        }

        await user.save();
      }
    }

    console.log("Middleware executed successfully")
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default addRecentlyView;
