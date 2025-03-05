import Router from 'express'
import authverify from '../middleware/auth.middleware.js'
import { addReview, getAllReviews,checkOrdesForReview } from '../controllers/review.controller.js';

const router = Router();

router.route("/add/:productId").post(authverify, addReview);
router.route("/get-all/:productId").get(getAllReviews);
router.route("/check-order/:productId").get(authverify, checkOrdesForReview)

export default router