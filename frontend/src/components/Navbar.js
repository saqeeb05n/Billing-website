import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Billing Website</h1>
      <ul>
        <li>
          <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/history" activeClassName="active">Invoice History</NavLink>
        </li>
        <li>
          <NavLink to="/inventory" activeClassName="active">Inventory</NavLink>
        </li>
        <li>
          <NavLink to="/generate-invoice" activeClassName="active">Generate Invoice</NavLink>
        </li>
        <li>
          <NavLink to="/store" activeClassName="active">Store Details</NavLink>
        </li>
        <li>
          <NavLink to="/" activeClassName="active">Logout</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
