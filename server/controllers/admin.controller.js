import { Product } from "../models/product.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.utils.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Category } from "../models/category.model.js";
import { Brand } from "../models/brand.model.js";
import mongoose from "mongoose";

const addProducts = async (req, res, next) => {
  try {
    const { title, description, price, stock, category, brand, specification } =
      req.body;

    if (
      [title, description, price, stock, category, brand, specification].some(
        (field) => !field || field?.toString().trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ message: "Invalid Brand ID" });
    }

    const files = req.files?.images;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const uploadPromises = files.map((file) => {
      return uploadFileOnCloudinary(file.path);
    });

    const uploadResults = await Promise.all(uploadPromises);

    const successfulUploads = uploadResults.filter(
      (result) => result.success === true
    );

    if (successfulUploads.length === 0) {
      return res.status(500).json({ message: "File upload failed" });
    }

    const productImages = successfulUploads.map(
      (upload) => upload.data.secure_url
    );

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      brand,
      specification: JSON.parse(specification),
      images: productImages,
    });

    const createdProduct = await Product.findById(product._id);

    if (!createdProduct) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong While Adding The Product" });
    }

    return res.status(201).json({
      message: "Product Added Successfully",
      product: createdProduct,
      productId: createdProduct._id,
    });
  } catch (error) {
    next(error);
  }
};

const editProductDetails = async (req, res, next) => {
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

      const uploadPromises = imageFiles.map((file) =>
        uploadFileOnCloudinary(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);

      newImageUrls = uploadResults
        .filter((upload) => upload.success === true)
        .map((upload) => upload.data.secure_url);
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
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    // console.log(productId)
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Prduct not found" });
    }

    await User.updateMany({ cart: productId }, { $pull: { cart: productId } });

    await Review.deleteMany({ reviewProduct: productId });

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      message: "Product Removed",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "All Fields Required!" });
    }

    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category Already Exists" });
    }

    const file = req.files?.image[0]?.path;
    // console.log(file)
    if (!file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    const uploadedFile = await uploadFileOnCloudinary(file);

    if (!uploadedFile) {
      return res.status(500).json({ message: "File Upload Failed" });
    }

    const category = await Category.create({
      name: name.trim().toLowerCase(),
      description: description.trim(),
      image: uploadedFile.data.secure_url,
    });

    if (!category) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res
      .status(201)
      .json({ message: "Category Added Successfully", category });
  } catch (error) {
    next(error);
  }
};

const addBrand = async (req, res, next) => {
  try {
    const { name, description, categories } = req.body;

    if ([name, description].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    if (
      !Array.isArray(categories) ||
      !categories.every(mongoose.Types.ObjectId.isValid)
    ) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const existingBrand = await Brand.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingBrand) {
      const existingCategories = new Set(
        existingBrand.categories.map((cat) => cat.toString())
      );
      const newCategories = categories.filter(
        (cat) => !existingCategories.has(cat)
      );

      if (newCategories.length > 0) {
        existingBrand.categories = [
          ...existingBrand.categories,
          ...newCategories,
        ];
        await existingBrand.save();
        return res.status(200).json({
          message: "Brand Updated Successfully",
          brand: existingBrand,
        });
      }

      return res.status(400).json({
        message: "All selected categories already exist in this brand.",
      });
    }

    const file = req.files?.logo?.[0]?.path;

    if (!file) {
      return res.status(400).json({ message: "Image File Required" });
    }

    const uploadedLogo = await uploadFileOnCloudinary(file);

    if (!uploadedLogo) {
      return res.status(400).json({ message: "File Uploaded Failed" });
    }

    const brand = await Brand.create({
      name: name.trim().toLowerCase(),
      description,
      categories,
      logo: uploadedLogo.data.secure_url,
    });

    if (!brand) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(201).json({ message: "Brand Added Successfully", brand });
  } catch (error) {
    next(error);
  }
};

const getBrandByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Plz Select Category" });
    }

    const brands = await Brand.find({
      categories: { $in: [category.trim().toLowerCase()] },
    });

    if (!brands || brands.length === 0) {
      return res.status(404).json({ message: "Brand Not Found" });
    }

    return res.status(200).json({
      message: "Brand fetched",
      brands,
    });
  } catch (error) {
    next(error);
  }
};

const getAllusers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      return res.status(404).json({ message: "Users Not Found" });
    }

    return res.status(200).json({ message: "All User Fetched", users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({ message: "All User Fetched", user });
  } catch (error) {
    next(error);
  }
};

const editUserbyId = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { userId } = req.params;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All Field Required" });
    }

    const editUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          name,
          email,
          phone,
        },
      },
      { new: true, upsert: false, runValidators: true }
    );

    if (!editUser) {
      return res
        .status(404)
        .json({ message: "User not found or update failed." });
    }

    return res
      .status(200)
      .json({ message: "User Update Successfully", editUser });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(400).json({ message: "Something Went Wrong" });
    }

    return res.status(200).json({ mesage: "User Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate("reviewBy", "name")
      .populate("reviewProduct", "title");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "Reviews Not Found!" });
    }

    return res
      .status(200)
      .json({ message: "Review Fetched Successfully", reviews });
  } catch (error) {
    next(error);
  }
};

const handleStatus = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review Not Found" });
    }

    (review.status = review.status === "Pending" ? "Approved" : "Pending"),
      await review.save();

    return res.status(200).json({ message: "Approved!", review });
  } catch (error) {
    next(error);
  }
};

const deleteReviewById = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review Not Found" });
    }

    const productId = review.reviewProduct;

    await Review.findByIdAndDelete(reviewId);

    const product = await Product.findById(productId);

    if (product) {
      product.reviews = product.reviews.filter(
        (id) => id.toString() === reviewId
      );
      await product.save();
    }

    return res.status(200).json({ message: "Review Deleted" });
  } catch (error) {
    next(error);
  }
};

const AccessToRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.role = role;
    await user.save();

    return res
      .status(200)
      .json({ message: `Now, ${user.name} is ${user.role}.` });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    let {
      skip = 0,
      limit = 5,
      searchTerm,
      status,
    } = req.query;

    skip = parseInt(skip);
    limit = parseInt(limit);


    let searchId;
    if (searchTerm) {
      searchId = mongoose.Types.ObjectId.isValid(searchTerm)
        ? new mongoose.Types.ObjectId(searchTerm)
        : null;
    }

    const orders = await Order.aggregate([
      { $unwind: { path: "$orderedItem", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "products",
          localField: "orderedItem.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "users",
          localField: "orderBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

      // Perform another lookup to fetch the address separately
      {
        $addFields: {
          matchedAddress: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$userDetails.addresses",
                  as: "addr",
                  cond: { $eq: ["$$addr._id", "$address"] },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $match: status
          ? { "orderedItem.status": { $regex: status, $options: "i" } }
          : {},
      },

      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { name: { $regex: searchTerm, $options: "i" } },
                  ...(searchId ? [{ _id: searchId }] : []),
                  {
                    "productDetails.title": {
                      $regex: searchTerm,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),


      {
        $group: {
          _id: "$_id",
          orderBy: { $first: "$orderBy" },
          name: { $first: "$name" },
          contact: { $first: "$contact" },
          address: { $first: "$matchedAddress" },
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          orderedItem: {
            $push: {
              productId: "$orderedItem.product",
              productTitle: "$productDetails.title",
              quantity: "$orderedItem.quantity",
              amount: "$orderedItem.amount",
              cancellationReason: "$orderedItem.cancellationReason",
              status: "$orderedItem.status",
              payStatus: "$orderedItem.payStatus",
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.status(200).json({
      message: "Order Fetched Successfully",
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
};

const validOrderStatusTransition = {
  Pending: ["Confirmed", "Canceled"],
  Confirmed: ["Completed", "Canceled"],
  Completed: [],
  Cancel: [],
};

const isValidStatusTransition = (currentStatus, newStatus) => {
  return validOrderStatusTransition[currentStatus]?.includes(newStatus);
};

const orderStatusUpdate = async (req, res, next) => {
  try {
    const { productId, orderId } = req.params;
    const { newStatus } = req.body;
    console.log(productId);
    // console.log(typeof newStatus);

    if (!newStatus) {
      return res.status(400).json({ message: "Request Body is Missing" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const productIndex = order.orderedItem.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the order" });
    }

    if (
      !isValidStatusTransition(
        order.orderedItem[productIndex].status,
        newStatus
      )
    ) {
      return res.status(400).json({ message: "Invalid Status Update" });
    }

    order.orderedItem[productIndex].status = newStatus;
    if (newStatus === "Canceled") {
      order.orderedItem[productIndex].payStatus = "Refunded";
      order.orderedItem[productIndex].cancellationReason = "Canceled By Admin";
    }

    const updatedOrderStatus = determineOrderStatus(order.orderedItem);
    order.orderStatus = updatedOrderStatus;

    await order.save();

    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    next(error);
  }
};

const determineOrderStatus = (orderedItems) => {
  const statuses = orderedItems.map((item) => item.status);

  if (statuses.every((status) => status === "Completed")) {
    return "Completed";
  }

  if (statuses.every((status) => status === "Canceled")) {
    return "Canceled";
  }

  if (statuses.every((status) => status === "Confirmed")) {
    return "Confirmed";
  }

  if (statuses.some((status) => status === "Completed")) {
    return "Completed";
  }
  if (statuses.every((status) => status === "Pending")) {
    return "Pending";
  }

  return "Confirmed";
};

const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    console.log("delete order", orderId);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ mesage: "Order Not Found" });
    }

    return res.status(200).json({ message: "Order Deleted" });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Something Went Wrong" });
    }

    const item = await Product.findById(productId).select("-reviews");

    if (!item) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export {
  addProducts,
  editProductDetails,
  deleteProduct,
  addCategory,
  getAllusers,
  getUserById,
  editUserbyId,
  deleteUserById,
  getAllReview,
  handleStatus,
  deleteReviewById,
  AccessToRole,
  getAllOrders,
  orderStatusUpdate,
  deleteOrder,
  getProductById,
  addBrand,
  getBrandByCategory,
};
