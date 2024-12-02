import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import {registerUser, loginUser, getCurrUser, addAddresses, deleteAddressById, updateAddress, handlePrimaryAddress} from '../controllers/user.controller.js'

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/getuser").get(authVerify, getCurrUser);
router.route("/address").post(authVerify, addAddresses)
router.route("/delete/address/:addressId").delete(authVerify, deleteAddressById)
router.route("/update/address/:addressId").patch(authVerify, updateAddress)
router.route("/address/:addressId/primary").patch(authVerify, handlePrimaryAddress)



export default router;