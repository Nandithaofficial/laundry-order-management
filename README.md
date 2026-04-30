# 🧺 Mini Laundry Order Management System

A lightweight REST API for managing dry cleaning orders — built with Node.js + Express.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/laundry-order-management.git
cd laundry-order-management
npm install
```

### Run (Development - In Memory)
```bash
npm run dev
```

### Run (Development - MongoDB)
```bash
npm run dev:mongo
```

### Run (Production)
```bash
npm start
```

Server starts at: `http://localhost:3000`

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| Create order with garments, qty, pricing | ✅ |
| Auto-generate unique Order ID | ✅ |
| Auto-calculate total bill | ✅ |
| Estimated delivery date (3 days) | ✅ |
| Update order status (RECEIVED → PROCESSING → READY → DELIVERED) | ✅ |
| List all orders | ✅ |
| Filter by status, name, phone, garment type | ✅ |
| Get single order by ID | ✅ |
| Delete order | ✅ |
| Dashboard (total orders, revenue, per-status breakdown) | ✅ |
| In-memory storage (no DB required) | ✅ |
| MongoDB storage (persistent) | ✅ |
| Postman collection | ✅ |

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create a new order |
| GET | `/orders` | List all orders (supports filters) |
| GET | `/orders/dashboard` | Dashboard summary |
| GET | `/orders/:orderId` | Get a single order |
| PATCH | `/orders/:orderId/status` | Update order status |
| DELETE | `/orders/:orderId` | Delete an order |

### Query Filters (GET /orders)
| Param | Example | Description |
|---|---|---|
| `status` | `?status=RECEIVED` | Filter by order status |
| `name` | `?name=Ravi` | Search by customer name |
| `phone` | `?phone=9876543210` | Search by phone number |
| `garmentType` | `?garmentType=Saree` | Filter by garment type |

### Create Order — Request Body
```json
{
  "customerName": "Ravi Kumar",
  "phone": "9876543210",
  "garments": [
    { "type": "Shirt", "quantity": 3 },
    { "type": "Saree", "quantity": 2 },
    { "type": "Pants", "quantity": 1, "pricePerItem": 70 }
  ]
}
```

### Default Price List
| Garment | Price (₹) |
|---|---|
| Shirt | 40 |
| Pants | 60 |
| Saree | 120 |
| Jacket | 150 |
| Suit | 200 |
| Kurta | 80 |
| Bedsheet | 100 |
| Other | 50 |

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — primary tool for scaffolding and code generation

### Sample Prompts Used
1. *"Build a Node.js Express REST API for a laundry order management system with in-memory storage, supporting create order, update status, filter orders, and dashboard endpoints."*
2. *"Add garment type filter to the GET /orders endpoint."*
3. *"Generate a Postman collection JSON for all the API endpoints."*
4. *"Write a README with setup instructions, API reference table, and AI usage report."*

### What AI Got Right
- Express boilerplate, middleware setup (cors, json)
- Controller structure and separation of concerns
- UUID-based order ID generation
- Dashboard aggregation logic
- Postman collection JSON structure

### What I Had to Fix / Improve
- AI initially put the `/dashboard` route after `/:orderId` — Express would catch `/dashboard` as an ID param. Fixed by moving it before the parameterized route.
- AI didn't include `pricePerItem` override in the create order body — added so callers can pass custom prices.
- AI used `req.body.status` without `.toUpperCase()` normalization — added for robustness.

---

## ⚖️ Tradeoffs

### What I Skipped
- **Authentication** — no login/token system
- **Input validation library** — using manual checks instead of Joi/Zod
- **Pagination** — GET /orders returns all records

### What I'd Add With More Time
- JWT-based authentication
- Pagination + sorting on list endpoint
- Order history / status change log
- SMS notification on status update (Twilio)
- Frontend dashboard (React)
- Deploy to Railway or Render

---

## 📁 Project Structure

```
laundry-order-management/
├── config/
│   └── db.js
├── controllers/
│   ├── orderController.js
│   └── orderController.mongo.js
├── data/
│   └── store.js
├── models/
│   └── Order.js
├── routes/
│   └── orders.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── postman_collection.json
├── README.md
├── server.js
└── server.mongo.js
```