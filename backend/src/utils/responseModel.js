class ResponseModel {
    static success(message = "Success", data = null, total = 0) {
        return {
            success: true,
            message,
            data,
            total
        };
    }

    static error(message = "Something went wrong", statusCode = 500) {
        return {
            success: false,
            message,
            statusCode
        };
    }
}

export default ResponseModel;
