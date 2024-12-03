import Router from 'express';
import { createOrder, verifyOrderPayment, getUserOrders  } from '../controllers/order.controller.js';
import authVerify from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(authVerify, createOrder);
router.route("/verify").post(authVerify, verifyOrderPayment);
router.route("/history").get(authVerify, getUserOrders)


export default router