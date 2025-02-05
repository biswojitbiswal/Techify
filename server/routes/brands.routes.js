import Router from 'express';
import {getAllBrand} from '../controllers/Brand.controller.js'

const router = Router();

router.route("/get-all").get(getAllBrand)

export default router