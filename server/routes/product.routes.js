import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import { getAllProducts, addToCart, removeItemCart, getCartItem, prosuctShowCase, getProductById } from "../controllers/product.controller.js";

const router = Router()

router.route("/get").get(getAllProducts);
router.route("/cart/add/:productId").post(authVerify, addToCart);
router.route("/cart/remove/:productId").patch(authVerify, removeItemCart);
router.route("/cart/get-products/:userId").get(authVerify, getCartItem);
router.route("/showcase").get(prosuctShowCase);
router.route("/product/:productId").get(getProductById)

export default router