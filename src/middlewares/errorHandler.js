const CustomError = require('../errors/custom-error.js');

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  console.error(err);
  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong!',
  });
};

module.exports = globalErrorHandler;
