const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/register", (req, res) => {
    const { email, password } = req.body;
    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "User registered" });
      }
    );
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query(
      "SELECT id FROM users WHERE email = ? AND password = ?",
      [email, password],
      (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.json({ success: false, message: "Invalid credentials" });
        res.json({ success: true, userId: results[0].id });
      }
    );
  });

  return router;
};
