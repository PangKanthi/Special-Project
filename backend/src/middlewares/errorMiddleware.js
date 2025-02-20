import ResponseModel from "../utils/responseModel.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    // 📌 จัดการ JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired";
    }

    // 📌 จัดการ Prisma Errors
    if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
    }
    if (err.code === "P2002") {
        statusCode = 409;
        message = "Duplicate entry. This record already exists.";
    }

    // 📌 ตรวจจับ Validation Errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Invalid input data";
    }

    // 📌 ตรวจจับ Bad Request
    if (err.status === 400) {
        statusCode = 400;
        message = err.message || "Bad Request";
    }

    // 📌 ส่ง Response ในรูปแบบ ResponseModel
    res.status(statusCode).json(ResponseModel.error(message));
};

export default errorMiddleware;
