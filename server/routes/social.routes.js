import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import adminVerify from '../middleware/admin.middleware.js'
import {fetchAndSavePost} from '../controllers/Social.controller.js'

const router = Router();

router.route("/fetch-post").post(authVerify, adminVerify, fetchAndSavePost)

export default router