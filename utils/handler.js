
export const errorHandler = async(res, message, code) => {
    return res.status(code).json({
        success: false,
        message
    });
}

export const successHandler = async(res, data, code) => {
    return res.status(code).json({
        success: true,
        data
    });
}