import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import adminVerify from '../middleware/verifyRole.middleware.js.js'
import {fetchAndSavePost, getAllSocialMediaPost} from '../controllers/Social.controller.js'

const router = Router();

router.route("/fetch-post").post(authVerify, adminVerify, fetchAndSavePost);
router.route("/get-posts").get(getAllSocialMediaPost);

export default router