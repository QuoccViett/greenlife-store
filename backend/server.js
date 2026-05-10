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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
