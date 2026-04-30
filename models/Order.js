const mongoose = require("mongoose");

const garmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    garments: { type: [garmentSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["RECEIVED", "PROCESSING", "READY", "DELIVERED"],
      default: "RECEIVED",
    },
    estimatedDelivery: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);