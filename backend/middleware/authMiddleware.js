

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Không có token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' })
    if (!user.isActive) return res.status(403).json({ message: 'Tài khoản đã bị khóa. Vui lòng liên hệ admin.' })

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

const adminOnly = (req, res, next) => {
    if(req.user?.role === 'admin') return next()
    res.status(403).json({ message: 'Chi Admin moi co quyen truy cap' })
}



module.exports = { protect, adminOnly }