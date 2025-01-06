import React, { useState } from "react";
import axios from "axios";

function StoreDetails() {
  const userId = localStorage.getItem("userId");

  const [store, setStore] = useState({
    name: "",
    phone: "",
    address: "",
    logo: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prevStore) => ({ ...prevStore, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await axios.post("http://localhost:5000/api/store", {
        ...store,
        userId,
      });

      if (response.data.success) {
        alert("Store details saved or updated successfully!");
      } else {
        alert("Failed to save or update store details.");
      }
    } catch (error) {
      console.error("Failed to save or update store details:", error);
      alert("An error occurred while saving store details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="store-details-container">
      <h2>Enter Store Details</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={store.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={store.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={store.address}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="logo"
          placeholder="Logo URL"
          value={store.logo}
          onChange={handleChange}
        />
        {store.logo && (
          <div className="logo-preview">
            <img src={store.logo} alt="Logo Preview" />
            <p>Logo Preview</p>
          </div>
        )}
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default StoreDetails;
