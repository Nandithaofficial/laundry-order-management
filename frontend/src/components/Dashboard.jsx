import { useState, useEffect } from "react";
import { getDashboard } from "../api";

const STATUS_COLORS = {
  RECEIVED: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  READY: "bg-green-100 text-green-700",
  DELIVERED: "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-12">Loading dashboard...</p>;
  if (!data) return <p className="text-center text-red-400 py-12">Failed to load dashboard.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">📊 Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-blue-700">{data.totalOrders}</p>
          <p className="text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-green-700">₹{data.totalRevenue}</p>
          <p className="text-gray-500 mt-1">Total Revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Orders by Status</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(data.ordersPerStatus).map(([status, count]) => (
            <div key={status} className={`rounded-xl p-4 text-center ${STATUS_COLORS[status]}`}>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-xs font-semibold mt-1">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}