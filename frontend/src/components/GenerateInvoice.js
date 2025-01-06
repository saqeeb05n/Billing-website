import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function GenerateInvoice() {
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [taxRate, setTaxRate] = useState(0);
  const [total, setTotal] = useState(0);
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    phone: "",
    address: "",
    logo: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/${userId}`);
        setItems(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/store/${userId}`);
        if (response.data.success && response.data.data.length > 0) {
          setStoreDetails(response.data.data[0]);
        } else {
          setStoreDetails({
            name: "Not Available",
            phone: "Not Available",
            address: "Not Available",
            logo: "",
          });
        }
      } catch (error) {
        setStoreDetails({
          name: "Not Available",
          phone: "Not Available",
          address: "Not Available",
          logo: "",
        });
      }
    };

    fetchItems();
    fetchStoreDetails();
  }, [userId]);

  useEffect(() => {
    const calculateTotal = () => {
      const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = (subtotal * taxRate) / 100;
      setTotal(subtotal + tax);
    };

    calculateTotal();
  }, [selectedItems, taxRate]);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Store Details
    doc.setFontSize(18);
    doc.text(storeDetails.name, 20, 20);
    doc.setFontSize(12);
    doc.text(`Phone: ${storeDetails.phone}`, 20, 30);
    doc.text(`Address: ${storeDetails.address}`, 20, 40);

    // Customer Details
    doc.setFontSize(16);
    doc.text("Customer Details:", 20, 60);
    doc.setFontSize(12);
    doc.text(`Name: ${customer.name}`, 20, 70);
    doc.text(`Phone: ${customer.phone}`, 20, 80);

    // Items
    doc.setFontSize(16);
    doc.text("Items:", 20, 100);
    selectedItems.forEach((item, index) => {
      doc.text(
        `${item.itemName} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`,
        20,
        110 + index * 10
      );
    });

    // Tax and Total
    doc.text(`Tax Rate: ${taxRate}%`, 20, 120 + selectedItems.length * 10);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, 130 + selectedItems.length * 10);

    // Save PDF
    doc.save("invoice.pdf");
  };

  const handleSaveInvoice = async () => {
    try {
      await axios.post("http://localhost:5000/api/invoice", {
        userId,
        customerName: customer.name,
        customerPhone: customer.phone,
        items: selectedItems,
        taxRate,
        totalPrice: total,
      });
      alert("Invoice saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save invoice.");
    }
  };

  const handleAddItem = (item) => {
    setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = quantity;
    setSelectedItems(updatedItems);
  };

  return (
    <div className="form-container">
      <h2>Generate Invoice</h2>
      <form>
        <input
          type="text"
          placeholder="Customer Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          required
        />
        <label>Items:</label>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.item_name} - ₹{item.price}
              <button type="button" onClick={() => handleAddItem(item)}>
                Add
              </button>
            </li>
          ))}
        </ul>

        <h3>Selected Items:</h3>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.itemName} - ₹{item.price} x{" "}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <input
          type="number"
          placeholder="Tax Rate (%)"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
        />
        <h3>Total: ₹{total.toFixed(2)}</h3>
        <button type="button" onClick={handleGeneratePDF}>
          Download Invoice
        </button>
        <button type="button" onClick={handleSaveInvoice}>
          Save Invoice
        </button>
      </form>
    </div>
  );
}

export default GenerateInvoice;
