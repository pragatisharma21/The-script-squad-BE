import logger from '../Utils/logger.js'

const errorHandler = (err, req, res, next) => {
  logger.error(
    `Error: ${err.message} | URL: ${req.originalUrl} | Method: ${req.method}`,
  )

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

export default errorHandler
