const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    if (statusCode === 500) {
        return res.status(statusCode).json({
            message: "Something Unexpected has Occured",
        });
    }
    const message = error.message;
    const data = error.data;
    return res.status(statusCode).json({
        message: message,
        data: data,
    });
};

module.exports = errorHandler;
