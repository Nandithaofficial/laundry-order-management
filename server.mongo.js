const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orders");

// Load env vars
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: "https://laundry-order-management-1-nl9v.onrender.com",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Laundry Order Management API (MongoDB) is running." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});