import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import { getAllProducts, addToCart, removeItemCart } from "../controllers/product.controller.js";

const router = Router()

router.route("/get").get(getAllProducts);
router.route("/cart/add/:productId").post(authVerify, addToCart);
router.route("/cart/remove/:productId").patch(authVerify, removeItemCart)

export default router