function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Zod validation errors
  if (err.issues && err.name === 'ZodError') {
    return res.status(400).json({
      message: 'validation error',
      errors: err.issues.map(i => ({ path: i.path, message: i.message }))
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `invalid ${err.path}` });
  }

  // Mongoose duplicate key (unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Fallback
  return res.status(status).json({
    message: err.message || 'server error'
  });
}

module.exports = { notFound, errorHandler };
