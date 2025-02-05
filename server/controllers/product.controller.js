import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const getAllProducts = async (req, res, next) => {
  try {
    const {
      skip = 0,
      limit = 9,
      sortOption,
      sortOrder,
      category,
      brand,
      searchTerm,
    } = req.query;

    const match = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      match.category = new mongoose.Types.ObjectId(category);
    }
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      match.brand = new mongoose.Types.ObjectId(brand);
    }

    const pipeline = [
      { $match: match },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $set: { category: { $arrayElemAt: ["$categoryDetails.name", 0] } } },

      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      
      { $set: { brand: { $arrayElemAt: ["$brandDetails.name", 0] } } },

      {
        $match: {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { category: { $regex: searchTerm, $options: "i" } },
            { brand: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },

      {
        $sort: { [sortOption || "createdAt"]: sortOrder === "asc" ? 1 : -1 },
      },

      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },

      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          images: 1,
          category: 1,
          brand: 1,
          averageRating: 1,
          createdAt: 1,
        },
      },
    ];

    const products = await Product.aggregate(pipeline);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products Not Found!" });
    }

    return res
      .status(200)
      .json({ 
        Allproducts: products, 
        hasMore: products.length === limit
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: "Item Already In Your Cart" });
    }

    user.cart.push(productId);
    await user.save();

    // console.log(user.cart);
    return res.status(200).json({
      message: "Added To Your Cart",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeItemCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: productId,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "Item removed from cart",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getCartItem = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing User ID" });
    }

    const user = await User.findById(userId).populate("cart").select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    next(error);
  }
};

const prosuctShowCase = async (req, res, next) => {
  try {
    const products = await Product.find({}).limit(10);

    if (!products) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json({ showcase: products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select("-reviews -category -brand")

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json({ item: product });
  } catch (error) {
    next(error);
  }
};

const getOrderItem = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    // console.log(productIds);

    if (!Array.isArray(productIds) || !productIds.length) {
      return res.status(400).json({
        message: "Invalid input: productIds should be a non-empty array",
      });
    }

    const itemIds = productIds.map((id) => new mongoose.Types.ObjectId(id));

    const orders = await Product.find({ _id: { $in: itemIds } }).select(
      "-reviews -brand -category -specification -averageRating"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProducts,
  addToCart,
  removeItemCart,
  getCartItem,
  prosuctShowCase,
  getProductById,
  getOrderItem,
};
