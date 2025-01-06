const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your database username
  password: "", // Replace with your database password
  database: "billing_system", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to the database");
});

// Routes

// User Registration with Store Details
app.post("/api/register", (req, res) => {
    const { email, password, storeName, storePhone, storeAddress, storeLogo } = req.body;
  
    const userQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    const storeQuery = "INSERT INTO stores (user_id, name, phone, address, logo) VALUES (?, ?, ?, ?, ?)";
  
    db.query(userQuery, [email, password], (err, userResult) => {
      if (err) {
        console.error("User Query Error:", err.message);
        return res.status(500).json({ success: false, message: "User registration failed" });
      }
  
      const userId = userResult.insertId;
      console.log("Generated User ID:", userId);
  
      db.query(storeQuery, [userId, storeName, storePhone, storeAddress, storeLogo], (storeErr, storeResult) => {
        if (storeErr) {
          console.error("Store Query Error:", storeErr.message);
          return res.status(500).json({ success: false, message: "Store details registration failed" });
        }
  
        console.log("Store Query Result:", storeResult);
        res.status(201).json({ success: true, message: "Registration successful" });
      });
    });
});
  


// User Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT id FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Login failed");
    } else if (result.length > 0) {
      res.status(200).send({ success: true, userId: result[0].id });
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
});

// Store Details
// Store Details - Add or Update
app.post("/api/store", async (req, res) => {
    const { userId, name, phone, address, logo } = req.body;
  
    console.log("Received data:", { userId, name, phone, address, logo }); // Debug log
  
    try {
      // Check if store details for the user already exist
      const queryCheck = "SELECT * FROM stores WHERE user_id = ?";
      const [existingStore] = await db.promise().query(queryCheck, [userId]);
  
      if (existingStore.length > 0) {
        // If store exists, update the record
        console.log("Updating existing store for user ID:", userId);
        const queryUpdate =
          "UPDATE stores SET name = ?, phone = ?, address = ?, logo = ? WHERE user_id = ?";
        await db.promise().query(queryUpdate, [name, phone, address, logo, userId]);
        return res.status(200).json({ message: "Store details updated successfully!" });
      }
  
      // If store doesn't exist, create a new record
      console.log("Inserting new store for user ID:", userId);
      const queryInsert =
        "INSERT INTO stores (user_id, name, phone, address, logo) VALUES (?, ?, ?, ?, ?)";
      await db.promise().query(queryInsert, [userId, name, phone, address, logo || null]);
      res.status(201).json({ message: "Store details saved successfully!" });
    } catch (error) {
      console.error("Error in /api/store:", error);
      res.status(500).json({ message: "Failed to save store details." });
    }
});
  
  
app.get("/api/store/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const query = "SELECT name, phone, address, logo FROM stores WHERE user_id = ?";
      const [store] = await db.promise().query(query, [userId]);
  
      if (store.length > 0) {
        res.status(200).json({ success: true, data: store[0] });
      } else {
        res.status(404).json({ success: false, message: "Store details not found." });
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
});
  
  
  
  
// Inventory Management
app.post("/api/inventory", (req, res) => {
  const { userId, itemName, price } = req.body;
  const query = "INSERT INTO inventory (user_id, item_name, price) VALUES (?, ?, ?)";
  db.query(query, [userId, itemName, price], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to add item");
    } else {
      res.status(201).send("Item added to inventory");
    }
  });
});

app.get("/api/inventory/:userId", (req, res) => {
  const { userId } = req.params;
  const query = "SELECT id, item_name, price FROM inventory WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to fetch inventory");
    } else {
      res.status(200).send({ data: results });
    }
  });
});

// Invoice Generation and History
app.post("/api/invoice", (req, res) => {
  const { userId, customerName, customerPhone, items, taxRate, totalPrice } = req.body;
  const query = "INSERT INTO invoices (user_id, customer_name, customer_phone, items, tax_rate, total_price) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [userId, customerName, customerPhone, JSON.stringify(items), taxRate, totalPrice],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to save invoice");
      } else {
        res.status(201).send("Invoice saved");
      }
    }
  );
});

app.get("/api/invoices/:userId", (req, res) => {
  const { userId } = req.params;
  const query = "SELECT * FROM invoices WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to fetch invoices");
    } else {
      res.status(200).send({ data: results });
    }
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
