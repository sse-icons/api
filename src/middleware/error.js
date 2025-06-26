/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with error details
 */
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  const response = {
    success: false,
    error: {
      code: statusCode,
      message: err.message || "Internal Server Error",
      stack: isProduction ? undefined : err.stack,
    },
    path: req.originalUrl,
  };

  if (!isProduction) {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
};
