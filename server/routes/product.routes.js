import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import { getAllProducts, addToCart } from "../controllers/product.controller.js";

const router = Router()

router.route("/get").get(authVerify, getAllProducts);
router.route("/cart/add/:productId").post(authVerify, addToCart);

export default router