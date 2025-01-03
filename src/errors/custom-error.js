class CustomError extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = status || 'error';
  }
}

module.exports = CustomError;
