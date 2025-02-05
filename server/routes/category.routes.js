import Router from 'express'
import getAllCategory from '../controllers/Category.controller.js';

const router = Router();

router.route("/get-all").get(getAllCategory);

export default router