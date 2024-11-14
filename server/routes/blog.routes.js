import Router from 'express'
import { getAllBlogs } from '../controllers/Blog.controller.js'

const router = Router()


router.route("/getblog").get(getAllBlogs)

export default router