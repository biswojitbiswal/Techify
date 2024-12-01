import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import {fetchAndSavePost, getAllSocialMediaPost} from '../controllers/Social.controller.js'
import verifyRole from "../middleware/verifyRole.middleware.js"

const router = Router();

router.route("/fetch-post").post(authVerify, verifyRole(['Admin', 'Moderator']), fetchAndSavePost);
router.route("/get-posts").get(getAllSocialMediaPost);

export default router