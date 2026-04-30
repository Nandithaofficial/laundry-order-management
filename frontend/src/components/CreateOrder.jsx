import { useState } from "react";
import { createOrder } from "../api";

const GARMENT_TYPES = ["Shirt", "Pants", "Saree", "Jacket", "Suit", "Kurta", "Bedsheet", "Other"];

export default function CreateOrder() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [garments, setGarments] = useState([{ type: "Shirt", quantity: 1 }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addGarment = () => setGarments([...garments, { type: "Shirt", quantity: 1 }]);

  const removeGarment = (i) => setGarments(garments.filter((_, idx) => idx !== i));

  const updateGarment = (i, field, value) => {
    const updated = [...garments];
    updated[i][field] = field === "quantity" ? parseInt(value) : value;
    setGarments(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (!customerName || !phone) return setError("Name and phone are required.");
    setLoading(true);
    try {
      const res = await createOrder({ customerName, phone, garments });
      setResult(res.data.order);
      setCustomerName("");
      setPhone("");
      setGarments([{ type: "Shirt", quantity: 1 }]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🧺 Create New Order</h2>

      <input className="w-full border rounded-lg p-2 mb-3" placeholder="Customer Name"
        value={customerName} onChange={e => setCustomerName(e.target.value)} />

      <input className="w-full border rounded-lg p-2 mb-4" placeholder="Phone Number"
        value={phone} onChange={e => setPhone(e.target.value)} />

      <h3 className="font-semibold mb-2 text-gray-700">Garments</h3>
      {garments.map((g, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <select className="border rounded-lg p-2 flex-1"
            value={g.type} onChange={e => updateGarment(i, "type", e.target.value)}>
            {GARMENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="number" min="1" className="border rounded-lg p-2 w-20"
            value={g.quantity} onChange={e => updateGarment(i, "quantity", e.target.value)} />
          {garments.length > 1 &&
            <button onClick={() => removeGarment(i)}
              className="text-red-500 font-bold px-2">✕</button>}
        </div>
      ))}

      <button onClick={addGarment}
        className="text-blue-600 text-sm mb-4 hover:underline">+ Add Garment</button>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
        {loading ? "Creating..." : "Create Order"}
      </button>

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <p className="font-bold text-green-700">✅ Order Created!</p>
          <p>Order ID: <span className="font-mono font-bold">{result.orderId}</span></p>
          <p>Total: <span className="font-bold">₹{result.totalAmount}</span></p>
          <p>Estimated Delivery: {result.estimatedDelivery}</p>
        </div>
      )}
    </div>
  );
}