import React, { useState } from "react";
import StoreDetails from "./StoreDetails";
import Inventory from "./Inventory";
import InvoiceGenerator from "./GenerateInvoice";
import InvoiceHistory from "./InvoiceHistory";

function Dashboard() {
  const [currentView, setCurrentView] = useState("invoiceGenerator");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const renderView = () => {
    switch (currentView) {
      case "invoiceGenerator":
        return <InvoiceGenerator />;      
      case "inventory":
        return <Inventory />;
      case "invoiceHistory":
        return <InvoiceHistory />;
      case "storeDetails":
        return <StoreDetails />;
      default:
        return <InvoiceGenerator />;
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button onClick={() => setCurrentView("inventory")}>Inventory</button>
        <button onClick={() => setCurrentView("invoiceGenerator")}>Generate Invoice</button>
        <button onClick={() => setCurrentView("invoiceHistory")}>Invoice History</button>
        <button onClick={() => setCurrentView("storeDetails")}>Store Details</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="dashboard-content">{renderView()}</div>
    </div>
  );
}

export default Dashboard;
