exports.formatValidationError = data => {
    const formatedError = new Error("Validation Failed");
    formatedError.statusCode = 422;
    formatedError.data = data;
    return formatedError;
};

exports.formatCustomError = (message, statusCode) => {
    const formatedError = new Error(message);
    formatedError.statusCode = statusCode;
    console.log(formatedError);
    return formatedError;
};

exports.format500error = error => {
    console.log(error);
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error;
};
