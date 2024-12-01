import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import {registerUser, loginUser, getCurrUser, addAddresses} from '../controllers/user.controller.js'

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/getuser").get(authVerify, getCurrUser);
router.route("/address").post(authVerify, addAddresses)


export default router;