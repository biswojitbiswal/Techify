import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addBlog, addProducts, editProductDetails, deleteProduct, deleteBlog, getAllusers, getUserById, editUserbyId, deleteUserById, getAllReview, handleStatus } from "../controllers/admin.controller.js";
import authVerify from "../middleware/auth.middleware.js";
import verifyRole from "../middleware/verifyRole.middleware.js.js";


const router = Router();

router.post(
    "/add",
    authVerify,
    verifyRole(['Admin']),
    upload.fields([{ name: "images", maxCount: 4 }]),
    addProducts);

router.route("/edit/:productId").patch(
    authVerify,
    verifyRole(['Admin', 'Moderator']),
    upload.fields([{ name: "images", maxCount: 4 }]),
    editProductDetails);

router.route("/publish/add").post(
    authVerify, 
    verifyRole(['Admin', 'Moderator']),
    upload.fields([
        {
            name: "blogImg",
            maxCount: 1,
        }
    ]), 
    addBlog);

router.route("/product/delete/:productId").delete(authVerify, verifyRole(['Admin']), deleteProduct)
router.route("/blog/delete/:blogId").delete(authVerify, verifyRole(['Admin', 'Moderator']), deleteBlog);
router.route("/get/users").get(authVerify, verifyRole(['Admin', 'Moderator']), getAllusers);
router.route("/user/:userId").get(authVerify, verifyRole(['Admin', 'Moderator']), getUserById);
router.route("/user/edit/:userId").patch(authVerify, verifyRole(['Admin', 'Moderator']), editUserbyId)
router.route("/user/delete/:userId").delete(authVerify, verifyRole(['Admin']), deleteUserById);
router.route("/get/reviews").get(authVerify, verifyRole(['Admin', 'Moderator']), getAllReview);
router.route("/status/:reviewId").patch(authVerify, verifyRole(['Admin', 'Moderator']), handleStatus)

export default router