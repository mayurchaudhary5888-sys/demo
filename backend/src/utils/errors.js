export class AppError extends Error {
  constructor(message, statusCode = 400, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFound = (_req, _res, next) => {
  next(new AppError("Route not found.", 404));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong." : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
  });
};
