

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExits = await User.findOne({email})
        if (userExits) return res.status(400).json({message: 'Email da ton tai'})
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({message: 'Email khong ton tai'})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({message: 'Sai mat khau'})

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getMe = async (req, res) => {
    res.json(req.user)
}

module.exports = { register, login, getMe }