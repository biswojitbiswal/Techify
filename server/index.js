import "dotenv/config"
import express from 'express'
import cors from 'cors'
import connectDb from './DB/db.js';
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/adminModerator.routes.js'
import productRouter from './routes/product.routes.js'
import blogRouter from './routes/blog.routes.js'
import socialRouter from './routes/social.routes.js'
import reviewRouter from './routes/review.routes.js'


const app = express();


const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET, POST, PUT, DELETE, PATCH, HEAD"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"));

app.use("/api/yoga/user", userRouter);
app.use("/api/yoga/admin", adminRouter);
app.use("/api/yoga/products", productRouter)
app.use("/api/yoga/blog", blogRouter)
app.use("/api/yoga/social", socialRouter)
app.use("/api/yoga/review", reviewRouter);


app.get("/", (req, res) => {
    res.send("My yoga product app page");
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