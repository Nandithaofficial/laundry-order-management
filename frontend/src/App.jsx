import { useState } from "react";
import CreateOrder from "./components/CreateOrder";
import OrderList from "./components/OrderList";
import Dashboard from "./components/Dashboard";

const TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "create", label: "➕ Create Order" },
  { id: "orders", label: "📦 Orders" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold">🧺 Laundry Order Management</h1>
        <p className="text-blue-200 text-sm">Dry Cleaning Store System</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b flex gap-1 px-6">
        {TABS.map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "create" && <CreateOrder />}
        {activeTab === "orders" && <OrderList />}
      </div>
    </div>
  );
}