/**
 * @file errorHandler.js
 * @description Centralized error handling middleware untuk Express.
 * Menangkap dan memformat response error secara konsisten ke client.
 */

/**
 * Express error handling middleware function
 * @param {Error} err - Error object caught by Express
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Next middleware function
 */
const errorHandler = (err, req, res, _next) => {
    console.error('❌ Server Error:', err.message);

    const statusCode = err.statusCode || 500;
    const response = {
        status: 'Error',
        message: err.message || 'Internal Server Error',
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
