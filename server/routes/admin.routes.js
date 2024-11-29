import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addBlog, addProducts, editProductDetails, deleteProduct, deleteBlog, getAllusers, getUserById, editUserbyId, deleteUserById } from "../controllers/admin.controller.js";
import authVerify from "../middleware/auth.middleware.js";
import adminVerify from "../middleware/admin.middleware.js"

const router = Router();

router.post(
    "/add",
    authVerify,
    adminVerify,
    upload.fields([{ name: "images", maxCount: 4 }]),
    addProducts);

router.route("/edit/:productId").patch(
    authVerify,
    adminVerify,
    upload.fields([{ name: "images", maxCount: 4 }]),
    editProductDetails);

router.route("/publish/add").post(
    authVerify, 
    adminVerify,
    upload.fields([
        {
            name: "blogImg",
            maxCount: 1,
        }
    ]), 
    addBlog);

router.route("/product/delete/:productId").delete(authVerify, adminVerify, deleteProduct)
router.route("/blog/delete/:blogId").delete(authVerify, adminVerify, deleteBlog);
router.route("/get/users").get(authVerify, adminVerify, getAllusers);
router.route("/user/:userId").get(authVerify, adminVerify, getUserById);
router.route("/user/edit/:userId").patch(authVerify, adminVerify, editUserbyId)
router.route("/user/delete/:userId").delete(authVerify, adminVerify, deleteUserById);

export default router