import Router from 'express';
import { createOrder, verifyOrderPayment  } from '../controllers/order.controller.js';
import authVerify from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(authVerify, createOrder);
router.route("/verify").post(authVerify, verifyOrderPayment);

export default router