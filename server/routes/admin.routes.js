import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProducts, editProductDetails } from "../controllers/admin.controller.js";
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

export default router