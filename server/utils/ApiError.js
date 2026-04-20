class ApiError extends Error {
  constructor(statusCode = 500, message = 'Server Error') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
