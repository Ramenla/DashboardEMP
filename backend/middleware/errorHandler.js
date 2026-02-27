/**
 * Centralized error handling middleware untuk Express.
 * Menangkap semua error yang di-throw atau di-next(err) dari route/controller.
 */
const errorHandler = (err, req, res, _next) => {
    console.error('❌ Server Error:', err.message);

    const statusCode = err.statusCode || 500;
    const response = {
        status: 'Error',
        message: err.message || 'Internal Server Error',
    };

    // Tampilkan stack trace hanya di development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
