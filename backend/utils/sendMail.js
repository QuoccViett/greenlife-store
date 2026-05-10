const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Chấp nhận các chứng chỉ tự ký, giúp vượt qua lỗi certificate chain
    rejectUnauthorized: false 
  }
})

const sendOrderConfirmEmail = async ({ to, order }) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0">
        <img src="${item.image || ''}" width="50" style="border-radius:8px;vertical-align:middle;margin-right:8px"/>
        ${item.name}
      </td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">x${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;color:#16a34a">
        $${(item.price * item.quantity).toLocaleString('en-US')}
      </td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:32px;text-align:center">
        <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
          <span style="font-size:24px"></span>
        </div>
        <h1 style="color:#fff;margin:0;font-size:24px">GreenLife Store</h1>
        <p style="color:#bbf7d0;margin:4px 0 0;font-size:14px">Đặt hàng thành công!</p>
      </div>

      <!-- Body -->
      <div style="padding:32px">
        <p style="color:#374151;font-size:15px;margin:0 0 8px">
          Xin chào <strong>${order.shippingAddress.fullName}</strong>,
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px;line-height:1.6">
          Cảm ơn bạn đã đặt hàng tại GreenLife Store! Đơn hàng của bạn đã được xác nhận và đang được xử lý.
        </p>

        <!-- Order info -->
        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#6b7280;font-size:13px">Mã đơn hàng</span>
            <span style="font-family:monospace;font-weight:600;color:#374151">#${order._id.toString().slice(-8).toUpperCase()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#6b7280;font-size:13px">Phương thức TT</span>
            <span style="font-weight:600;color:#374151">${order.paymentMethod.toUpperCase()}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:#6b7280;font-size:13px">Địa chỉ giao hàng</span>
            <span style="font-weight:600;color:#374151;text-align:right;max-width:200px">
              ${order.shippingAddress.address}, ${order.shippingAddress.city}
            </span>
          </div>
        </div>

        <!-- Items -->
        <h3 style="color:#374151;font-size:15px;margin:0 0 12px">Sản phẩm đã đặt</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Sản phẩm</th>
              <th style="padding:8px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">SL</th>
              <th style="padding:8px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Giá</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>

        <!-- Total -->
        <div style="border-top:2px solid #e5e7eb;margin-top:16px;padding-top:16px;text-align:right">
          <span style="font-size:16px;font-weight:700;color:#16a34a">
            Tổng cộng: $${order.totalPrice.toLocaleString('en-US')}
          </span>
        </div>

        <!-- Track button -->
        <div style="text-align:center;margin-top:28px">
          <a href="${process.env.CLIENT_URL}/profile"
            style="background:#16a34a;color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            Theo dõi đơn hàng
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="color:#9ca3af;font-size:12px;margin:0">
          © 2025 GreenLife Store · Sống xanh mỗi ngày
        </p>
        <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">
          Hotline: 1800 1234 · Email: hello@greenlife.vn
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"GreenLife Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Đặt hàng thành công #${order._id.toString().slice(-8).toUpperCase()} - GreenLife Store`,
    html,
  })
}

const sendOrderStatusEmail = async ({ to, order, newStatus }) => {
  const statusMap = {
    processing: { text: 'Đang xử lý', color: '#2563eb' },
    shipping: { text: 'Đang giao hàng', color: '#7c3aed' },
    delivered: { text: 'Đã giao hàng', color: '#16a34a' },
    cancelled: { text: 'Đã hủy', color: '#dc2626' },
  }

  const status = statusMap[newStatus] || { text: newStatus, color: '#374151' }

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:32px;text-align:center">
        <span style="font-size:40px">${status.icon}</span>
        <h1 style="color:#fff;margin:8px 0 0;font-size:22px">Cập nhật đơn hàng</h1>
      </div>
      <div style="padding:32px">
        <p style="color:#374151;font-size:15px;margin:0 0 16px">
          Xin chào <strong>${order.shippingAddress?.fullName || 'Quý khách'}</strong>,
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
          Đơn hàng <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> của bạn đã được cập nhật trạng thái:
        </p>
        <div style="background:${status.color}15;border:1px solid ${status.color}30;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px">
          <span style="font-size:28px">${status.icon}</span>
          <p style="color:${status.color};font-weight:700;font-size:18px;margin:8px 0 0">${status.text}</p>
        </div>
        <div style="text-align:center">
          <a href="${process.env.CLIENT_URL}/profile"
            style="background:#16a34a;color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
            Xem chi tiết đơn hàng
          </a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="color:#9ca3af;font-size:12px;margin:0">© 2025 GreenLife Store</p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"GreenLife Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Đơn hàng #${order._id.toString().slice(-8).toUpperCase()} - ${status.text}`,
    html,
  })
}

module.exports = { sendOrderConfirmEmail, sendOrderStatusEmail }