

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Khong co token, tu choi truy cap' })
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token khong hop le' })
    }
}

const adminOnly = (req, res, next) => {
    if(req.user?.role === 'admin') return next()
    res.status(403).json({ message: 'Chi Admin moi co quyen truy cap' })
}

module.exports = { protect, adminOnly }