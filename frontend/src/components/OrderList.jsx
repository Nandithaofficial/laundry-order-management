import { useState, useEffect } from "react";
import { getOrders, updateStatus, deleteOrder } from "../api";

const STATUSES = ["", "RECEIVED", "PROCESSING", "READY", "DELIVERED"];

const STATUS_COLORS = {
  RECEIVED: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  READY: "bg-green-100 text-green-700",
  DELIVERED: "bg-gray-100 text-gray-600",
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: "", name: "", phone: "", garmentType: "" });
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.name) params.name = filters.name;
      if (filters.phone) params.phone = filters.phone;
      if (filters.garmentType) params.garmentType = filters.garmentType;
      const res = await getOrders(params);
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📦 All Orders</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
        <select className="border rounded-lg p-2 text-sm"
          value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          {STATUSES.map(s => <option key={s} value={s}>{s || "All Statuses"}</option>)}
        </select>
        <input className="border rounded-lg p-2 text-sm" placeholder="Search by name"
          value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input className="border rounded-lg p-2 text-sm" placeholder="Search by phone"
          value={filters.phone} onChange={e => setFilters({ ...filters, phone: e.target.value })} />
        <input className="border rounded-lg p-2 text-sm" placeholder="Search by garment"
          value={filters.garmentType} onChange={e => setFilters({ ...filters, garmentType: e.target.value })} />
      </div>

      <button onClick={fetchOrders}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
        🔍 Search
      </button>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-400 text-center py-8">No orders found.</p>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.orderId} className="border rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800">{order.customerName}
                  <span className="text-gray-400 font-normal text-sm ml-2">{order.phone}</span>
                </p>
                <p className="text-xs text-gray-400 font-mono">{order.orderId}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {order.garments.map((g, i) => (
                <span key={i} className="mr-3">{g.type} x{g.quantity} (₹{g.subtotal})</span>
              ))}
            </div>

            <div className="mt-2 flex justify-between items-center">
              <p className="font-bold text-green-700">Total: ₹{order.totalAmount}
                <span className="text-xs text-gray-400 font-normal ml-2">
                  Delivery: {order.estimatedDelivery}
                </span>
              </p>
              <div className="flex gap-2 items-center">
                <select className="border rounded-lg p-1 text-xs"
                  value={order.status}
                  onChange={e => handleStatusChange(order.orderId, e.target.value)}>
                  {STATUSES.filter(s => s).map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => handleDelete(order.orderId)}
                  className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}