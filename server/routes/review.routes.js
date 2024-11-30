import Router from 'express'
import authverify from '../middleware/auth.middleware.js'
import { addReview } from '../controllers/review.controller.js';

const router = Router();

router.route("/add/:productId").post(authverify, addReview);

export default router