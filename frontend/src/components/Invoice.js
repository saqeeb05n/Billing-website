import React, { useState } from "react";
import axios from "axios";

function Invoice() {
  const [details, setDetails] = useState({
    customerName: "",
    items: "",
    total: "",
  });

  const handleGenerateInvoice = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/invoice", { userId, ...details });
      alert("Invoice generated successfully!");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    }
  };

  return (
    <div className="invoice-container">
      <h2>Generate Invoice</h2>
      <input
        type="text"
        placeholder="Customer Name"
        onChange={(e) => setDetails({ ...details, customerName: e.target.value })}
      />
      <textarea
        placeholder="Items"
        onChange={(e) => setDetails({ ...details, items: e.target.value })}
      ></textarea>
      <input
        type="number"
        placeholder="Total"
        onChange={(e) => setDetails({ ...details, total: e.target.value })}
      />
      <button onClick={handleGenerateInvoice}>Generate Invoice</button>
    </div>
  );
}

export default Invoice;
