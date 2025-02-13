import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import {registerUser, loginUser, authnticateWithGoogle, getCurrUser, profileImageUpdate, addAddresses, deleteAddressById, updateAddress, handlePrimaryAddress, changeUsername} from '../controllers/user.controller.js'
import {upload} from '../middleware/multer.middleware.js'
const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/google").post(authnticateWithGoogle);
router.route("/getuser").get(authVerify, getCurrUser);
router.route("/address").post(authVerify, addAddresses)
router.route("/delete/address/:addressId").delete(authVerify, deleteAddressById)
router.route("/update/address/:addressId").patch(authVerify, updateAddress)
router.route("/address/:addressId/primary").patch(authVerify, handlePrimaryAddress)
router.route("/profile/image").patch(
    authVerify,
    upload.fields([
        {
            name: 'profile',
            maxCount: 1,
        }
    ]),
    profileImageUpdate
);

router.route("/username").patch(authVerify, changeUsername);



export default router;