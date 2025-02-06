import morgan from 'morgan'
import logger from '../Utils/logger.js'

const requestLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res)
  const statusColor =
    status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m'

  const logMessage = `${tokens.method(req, res)} ${tokens.url(req, res)} ${
    statusColor + status + '\x1b[0m'
  } ${tokens['response-time'](req, res)}ms - ${tokens['user-agent'](req, res)}`

  logger.info(logMessage)
  return logMessage
})

export default requestLogger
