import "dotenv/config"
import express from 'express'
import cors from 'cors'
import connectDb from './DB/db.js';
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/adminModerator.routes.js'
import productRouter from './routes/product.routes.js'
import socialRouter from './routes/social.routes.js'
import reviewRouter from './routes/review.routes.js'
import orderRouter from './routes/order.routes.js'
import contactRouter from './routes/contact.routes.js'
import categoryRouter from './routes/category.routes.js'
import brandRouter from './routes/brands.routes.js';



const app = express();


const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://yoga-app-sandy.vercel.app"]
  : "*";

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET, POST, PUT, DELETE, PATCH, HEAD"],
    credentials: true
}))

app.use(errorMiddleware);

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"));


app.use("/api/techify/user", userRouter);
app.use("/api/techify/admin", adminRouter);
app.use("/api/techify/products", productRouter)
app.use("/api/techify/social", socialRouter)
app.use("/api/techify/review", reviewRouter);
app.use("/api/techify/order", orderRouter);
app.use("/api/techify/contact", contactRouter);
app.use("/api/techify/category", categoryRouter);
app.use("/api/techify/brands", brandRouter);



app.get("/", (req, res) => {
    res.send("My Techify product app page");
})

connectDb()
.then(() => {
    app.on("error", (error) => {
        console.log("Error", error);
        throw error;
    })
    app.listen(PORT, () => {
        console.log(`App is Listening on: ${PORT}`);
    })
    
    
})
.catch((error) => {
    console.log("Connection Failed", error);
})