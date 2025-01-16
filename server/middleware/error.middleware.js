const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error"
        }
    })
}

export default errorMiddleware;