import Router from 'express';
import { createOrder, verifyOrderPayment, getUserOrders, cancelOrder  } from '../controllers/order.controller.js';
import authVerify from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(authVerify, createOrder);
router.route("/verify").post(authVerify, verifyOrderPayment);
router.route("/get").get(authVerify, getUserOrders)
router.route("/:orderId/:productId/cancel").patch(authVerify, cancelOrder)


export default router