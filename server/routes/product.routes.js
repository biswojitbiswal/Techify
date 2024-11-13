import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import { getAllProducts } from "../controllers/product.controller.js";

const router = Router()

router.route("/get").get(authVerify, getAllProducts)

export default router