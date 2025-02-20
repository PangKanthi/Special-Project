import ResponseModel from "../utils/responseModel.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired";
    }
    if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
    }

    res.status(statusCode).json(ResponseModel.error(message));
};

export default errorMiddleware;
