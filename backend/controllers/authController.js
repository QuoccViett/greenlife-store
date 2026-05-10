

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

const register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body
        if (!address) return res.status(400).json({message: 'Dia chi giao hang mac dinh la bat buoc'})
        const userExits = await User.findOne({email})
        if (userExits) return res.status(400).json({message: 'Email da ton tai'})

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword, address })

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

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status.json({message: 'Khong tim thay nguoi dung'})

        user.name = req.body.name || user.name
        user.phone = req.body.phone || user.phone
        user.address = req.body.address || user.address

        const updated = await user.save()
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            address: updated.address,
            role: updated.role,
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login, getMe, updateProfile }