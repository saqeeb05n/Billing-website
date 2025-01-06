import React, { useState, useEffect } from "react";
import axios from "axios";

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: "", price: "" });

  const userId = localStorage.getItem("userId");

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/${userId}`);
      setItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/inventory", { ...newItem, userId });
      fetchInventory();
      setNewItem({ itemName: "", price: "" });
      alert("Item added!");
    } catch (error) {
      console.error(error);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="form-container">
      <h2>Inventory</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={newItem.itemName}
          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <h3>Current Inventory</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.item_name} - ₹{item.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
