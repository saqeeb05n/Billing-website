import React, { useState } from "react";
import axios from "axios";

function Register({ setCurrentView }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Sent to API:", formData); // Debugging log

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      console.log("API Response:", response.data); // Log API response
      alert("Registration successful! Please login.");
      setCurrentView("login");
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message); // Log error response
      alert("Registration failed. Try again!");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => setCurrentView("landing")}>Back to Home</button>
    </div>
  );
}

export default Register;
