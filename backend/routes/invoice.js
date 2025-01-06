const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/invoice", (req, res) => {
    const { userId, customerName, customerPhone, items, taxRate, totalPrice } = req.body;
    db.query(
      "INSERT INTO invoices (user_id, customer_name, customer_phone, items, tax_rate, total_price) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, customerName, customerPhone, JSON.stringify(items), taxRate, totalPrice],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Invoice saved" });
      }
    );
  });

  router.get("/invoices/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM invoices WHERE user_id = ?", [userId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: results });
    });
  });

  return router;
};
