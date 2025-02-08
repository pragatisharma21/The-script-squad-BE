import jwt from 'jsonwebtoken'

export const isAuthenticated = (req, res, next) => {
  const tokenData = req.header('Authorization')
  const token = tokenData.replace('Bearer', '').trim()
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    next(err)
  }
}

export const isSuperAdmin = (req, res, next) => {
  const tokenData = req.header('Authorization')
  if (!tokenData) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  const token = tokenData.replace('Bearer', '').trim()
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.userType !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Access denied. Only Super Admins are allowed.' })
    }

    req.admin = decoded
    next()
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Invalid token', error: err.message })
  }
}
