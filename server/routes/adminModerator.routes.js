import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addProducts, editProductDetails, deleteProduct, getAllusers, getUserById, editUserbyId, deleteUserById, getAllReview, handleStatus, deleteReviewById, AccessToRole, getAllOrders, orderStatusUpdate,deleteOrder, getProductById, addCategory, addBrand,  getBrandByCategory, getAllAnalyticsForOrders, getOrderDataLine, getOrderPieData, getUsersAnalytic, getUserLineChartData} from "../controllers/admin.controller.js";
import authVerify from "../middleware/auth.middleware.js";
import verifyRole from "../middleware/verifyRole.middleware.js";

const router = Router();

router.post(
    "/add",
    authVerify,
    verifyRole(['Admin']),
    upload.fields([{ name: "images", maxCount: 4 }]),
    addProducts);

router.route("/edit/:productId").patch(
    authVerify,
    verifyRole(['Admin', 'Moderator']),
    upload.fields([{ name: "images", maxCount: 4 }]),
    editProductDetails);


router.route("/product/delete/:productId").delete(authVerify, verifyRole(['Admin']), deleteProduct)

router.route("/get/users").get(authVerify, verifyRole(['Admin', 'Moderator'])
, getAllusers);

router.route("/user/:userId").get(authVerify, verifyRole(['Admin', 'Moderator']), getUserById);

router.route("/user/edit/:userId").patch(authVerify, verifyRole(['Admin', 'Moderator']), editUserbyId)

router.route("/user/delete/:userId").delete(authVerify, verifyRole(['Admin']), deleteUserById);

router.route("/get/reviews").get(authVerify, verifyRole(['Admin', 'Moderator']), getAllReview);

router.route("/status/:reviewId").patch(authVerify, verifyRole(['Admin', 'Moderator']), handleStatus)

router.route("/delete/review/:reviewId").delete(authVerify, verifyRole(['Admin', 'Moderator']), deleteReviewById)

router.route("/assign/role/:userId").patch(authVerify, verifyRole(['Admin']), AccessToRole)

router.route("/orders").get(authVerify, verifyRole(['Admin', 'Moderator']), getAllOrders)

router.route("/status/:productId/:orderId").patch(authVerify, verifyRole(['Admin']), orderStatusUpdate)

router.route("/:orderId/:productId/delete").delete(authVerify, verifyRole(['Admin']), deleteOrder);

router.route("/product/:productId").get(authVerify, verifyRole(['Admin', 'Moderator']), getProductById)


router.route("/add/category").post(
    authVerify, 
    verifyRole(['Admin']),
    upload.fields([
        {
            name: 'image',
            maxCount: 1,
        }
    ]),
    addCategory
)

router.route("/add/brand").post(
    authVerify,
    verifyRole(['Admin']),
    upload.fields([
        {
            name: 'logo',
            maxCount: 1,
        }
    ]),
    addBrand
)

router.route("/brand").get(authVerify, verifyRole(['Admin']), getBrandByCategory)

router.route("/get-analytics").get(authVerify, verifyRole(["Admin"]), getAllAnalyticsForOrders)

router.route("/get-linedata/:timeRange").get(authVerify, verifyRole(['Admin']), getOrderDataLine)

router.route("/get-piedata/:timeRange").get(authVerify, verifyRole(['Admin']), getOrderPieData)

router.route("/get-users-analytic").get(authVerify, verifyRole(['Admin']), getUsersAnalytic)

router.route("/get-users-linechart/:timeRange").get(authVerify, verifyRole(['Admin']), getUserLineChartData);


export default router