const { orders } = require("../data/store");
const { v4: uuidv4 } = require("uuid");

const VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

// Hardcoded price list (configurable)
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

// Estimated delivery: 3 days from order creation
function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

// POST /api/orders — Create a new order
exports.createOrder = (req, res) => {
  const { customerName, phone, garments } = req.body;

  if (!customerName || !phone || !garments || !Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({ error: "customerName, phone, and garments[] are required." });
  }

  let totalAmount = 0;
  const parsedGarments = [];

  for (const g of garments) {
    const { type, quantity } = g;
    if (!type || !quantity || quantity < 1) {
      return res.status(400).json({ error: `Invalid garment entry: ${JSON.stringify(g)}` });
    }
    const pricePerItem = g.pricePerItem ?? PRICE_LIST[type] ?? PRICE_LIST["Other"];
    const subtotal = pricePerItem * quantity;
    totalAmount += subtotal;
    parsedGarments.push({ type, quantity, pricePerItem, subtotal });
  }

  const order = {
    orderId: "ORD-" + uuidv4().slice(0, 8).toUpperCase(),
    customerName,
    phone,
    garments: parsedGarments,
    totalAmount,
    status: "RECEIVED",
    estimatedDelivery: getEstimatedDelivery(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json({ message: "Order created successfully.", order });
};

// GET /api/orders — List all orders with optional filters
exports.getOrders = (req, res) => {
  const { status, name, phone, garmentType } = req.query;
  let result = [...orders];

  if (status) {
    result = result.filter(o => o.status === status.toUpperCase());
  }
  if (name) {
    result = result.filter(o => o.customerName.toLowerCase().includes(name.toLowerCase()));
  }
  if (phone) {
    result = result.filter(o => o.phone.includes(phone));
  }
  if (garmentType) {
    result = result.filter(o =>
      o.garments.some(g => g.type.toLowerCase() === garmentType.toLowerCase())
    );
  }

  res.json({ count: result.length, orders: result });
};

// GET /api/orders/:orderId — Get a single order
exports.getOrderById = (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json(order);
};

// PATCH /api/orders/:orderId/status — Update order status
exports.updateStatus = (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });

  order.status = status.toUpperCase();
  order.updatedAt = new Date().toISOString();
  res.json({ message: "Status updated.", order });
};

// GET /api/dashboard — Summary stats
exports.getDashboard = (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const ordersPerStatus = VALID_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  res.json({ totalOrders, totalRevenue, ordersPerStatus });
};

// DELETE /api/orders/:orderId — Delete an order
exports.deleteOrder = (req, res) => {
  const idx = orders.findIndex(o => o.orderId === req.params.orderId);
  if (idx === -1) return res.status(404).json({ error: "Order not found." });
  orders.splice(idx, 1);
  res.json({ message: "Order deleted." });
};