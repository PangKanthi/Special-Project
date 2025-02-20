class ResponseModel {
    constructor(success = false, message = '', data = null, total = 0) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.total = total;
    }

    static success(message = "Success", data = null, total = 0) {
        return new ResponseModel(true, message, data, total);
    }

    static error(message = "Error", data = null) {
        return new ResponseModel(false, message, data);
    }
}

export default ResponseModel;
