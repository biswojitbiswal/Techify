import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addBlog, addProducts, editProductDetails, deleteProduct, deleteBlog } from "../controllers/admin.controller.js";
import authVerify from "../middleware/auth.middleware.js";
import adminVerify from "../middleware/admin.middleware.js"

const router = Router();

router.route("/add").post(
    authVerify,
    adminVerify,
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    addProducts);

router.route("/edit/:productId").patch(
    authVerify,
    adminVerify,
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
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

export default router