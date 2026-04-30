const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");

const VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

const PRICE_LIST = {
  Shirt: 40,
  Pants: 60,
  Saree: 120,
  Jacket: 150,
  Suit: 200,
  Kurta: 80,
  Bedsheet: 100,
  Other: 50,
};

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, garments } = req.body;

    if (!customerName || !phone || !Array.isArray(garments) || garments.length === 0) {
      return res.status(400).json({ error: "customerName, phone, and garments[] are required." });
    }

    let totalAmount = 0;
    const parsedGarments = [];

    for (const g of garments) {
      const { type, quantity } = g;
      if (!type || !quantity || quantity < 1) {
        return res.status(400).json({ error: `Invalid garment: ${JSON.stringify(g)}` });
      }
      const pricePerItem = g.pricePerItem ?? PRICE_LIST[type] ?? PRICE_LIST["Other"];
      const subtotal = pricePerItem * quantity;
      totalAmount += subtotal;
      parsedGarments.push({ type, quantity, pricePerItem, subtotal });
    }

    const order = await Order.create({
      orderId: "ORD-" + uuidv4().slice(0, 8).toUpperCase(),
      customerName,
      phone,
      garments: parsedGarments,
      totalAmount,
      estimatedDelivery: getEstimatedDelivery(),
    });

    res.status(201).json({ message: "Order created successfully.", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { status, name, phone, garmentType } = req.query;
    const filter = {};

    if (status) filter.status = status.toUpperCase();
    if (name) filter.customerName = { $regex: name, $options: "i" };
    if (phone) filter.phone = { $regex: phone };
    if (garmentType) filter["garments.type"] = { $regex: new RegExp(`^${garmentType}$`, "i") };

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersPerStatus = VALID_STATUSES.reduce((acc, s) => {
      acc[s] = statusAgg.find(x => x._id === s)?.count ?? 0;
      return acc;
    }, {});

    res.json({ totalOrders, totalRevenue, ordersPerStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:orderId
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:orderId/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: status.toUpperCase() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ message: "Status updated.", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/orders/:orderId
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ message: "Order deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};