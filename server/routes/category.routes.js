import Router from 'express'
import {getAllCategory, getProductByCategoryAndBrand} from '../controllers/Category.controller.js';

const router = Router();

router.route("/get-all").get(getAllCategory);
router.route("/product/:categoryId").get(getProductByCategoryAndBrand);

export default router