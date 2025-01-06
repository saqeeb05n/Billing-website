import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css"; // Ensure your CSS file is properly linked
import logo from "./components/img/Home.png";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const isLoggedIn = localStorage.getItem("userId");

  const renderView = () => {
    if (isLoggedIn) {
      return <Dashboard />;
    }

    switch (currentView) {
      case "login":
        return <Login setCurrentView={setCurrentView} />;
      case "register":
        return <Register setCurrentView={setCurrentView} />;
      default:
        return (
          <div className="landing-page">
            <div className="landing-content">
              <img
                src={logo}
                alt="Billing System Logo"
                className="landing-logo"
              />
              <h1 className="landing-heading">Welcome to the Billing System</h1>
              <p className="landing-description">
                Streamline your billing process with ease! Manage your store,
                inventory, and invoices seamlessly, all in one place. Join us to
                make your business operations efficient and hassle-free.
              </p>
              <div className="landing-buttons">
                <button
                  className="btn btn-login"
                  onClick={() => setCurrentView("login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-register"
                  onClick={() => setCurrentView("register")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="app-container">{renderView()}</div>;
}

export default App;
