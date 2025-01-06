import React, { useState, useEffect } from "react";
import axios from "axios";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/invoices/${userId}`);
        setInvoices(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInvoices();
  }, [userId]);

  return (
    <div className="invoice-history-container">
      <h2>Invoice History</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Items</th>
            <th>Total (₹)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.customer_name}</td>
              <td>{invoice.customer_phone}</td>
              <td>
                <ul>
                  {JSON.parse(invoice.items).map((item, index) => (
                    <li key={index}>
                      {item.itemName} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{invoice.total_price}</td>
              <td>{new Date(invoice.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceHistory;
