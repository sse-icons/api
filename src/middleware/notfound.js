/**
 * Express Middleware for handling 404 Not Found errors
 * @returns {Function} Express middleware function
 */
exports.notFound = (req, res, next) => {
    const error= new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
}