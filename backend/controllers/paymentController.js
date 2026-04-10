

const moment = require('moment-timezone')
const crypto = require('crypto')
const Order = require('../models/Order')

const sortObject = (obj) => {
    const sorted = {}
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key]
    })
    return sorted
}

const createVNPayUrl = async (req, res) => {
    try {
        const { orderId, amount } = req.body

        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ message: 'Khong tim thay don hang' })

        // const date = new Date()
        // const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
        // const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
        //     .toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)


        const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')
        const expireDate = moment().tz('Asia/Ho_Chi_Minh').add(15, 'minutes').format('YYYYMMDDHHmmss')

        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNPAY_TMN_CODE,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: Math.round(amount * 24000) * 100,
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
            vnp_IpAddr: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
        }

        const sortedParams = sortObject(vnpParams)
        const signData = new URLSearchParams(sortedParams).toString()
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
        sortedParams.vnp_SecureHash = signed

        const paymentUrl = `${process.env.VNPAY_URL}?${new URLSearchParams(sortedParams).toString()}`
        res.json({ paymentUrl })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const vnpayReturn = async (req, res) => {
    try {
        const vnpParams = { ...req.query }
        const secureHash = vnpParams.vnp_SecureHash
        delete vnpParams.vnp_SecureHash
        delete vnpParams.vnp_SecureHashType

        const sortedParams = sortObject(vnpParams)
        const signData = new URLSearchParams(sortedParams).toString()
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        if (secureHash !== signed) {
            return res.json({ code: '97', message: 'Chu ky khong hop le' })
        }

        const orderId = vnpParams.vnp_TxnRef
        const responseCode = vnpParams.vnp_ResponseCode

        if (responseCode === '00') {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'paid',
                paidAt: new Date(),
                orderStatus: 'processing',
            })
            res.json({ code: '00', message: 'Thanh toan thanh cong', orderId })
        } else {
            res.json({ code: responseCode, message: 'Thanh toan that bai', orderId })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { createVNPayUrl, vnpayReturn }