const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");

const app = express();

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://greenlife-store.vercel.app", /\.vercel\.app$/],
    credentials: true,
  }),
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "GreenLife API đang chạy!" });
});

// Kết nối MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB đã kết nối'))
//   .catch(err => console.log('Lỗi kết nối:', err))

app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/products", require("./routes/productRoutes.js"));
app.use("/api/categories", require("./routes/categoryRoutes.js"));
app.use("/api/orders", require("./routes/orderRoutes.js"));
app.use("/api/cart", require("./routes/cartRoutes.js"));
app.use("/api/admin", require("./routes/adminRoutes.js"));
app.use("/api/payment", require("./routes/paymentRoutes.js"));
app.use("/api/suppliers", require("./routes/supplierRoutes.js"));
app.use("/api/purchases", require("./routes/purchaseRoutes.js"));

// Mỗi 10 phút: hủy đơn online quá 30 phút chưa thanh toán và hoàn kho
const { cancelOverdueOnlineOrders } = require("./utils/stock");
setInterval(async () => {
  try {
    const n = await cancelOverdueOnlineOrders(30);
    if (n) console.log(`Đã tự hủy ${n} đơn quá hạn thanh toán`);
  } catch (e) {
    console.log("Lỗi job hủy đơn quá hạn:", e.message);
  }
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
