const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/inventory", (req, res) => {
    const { userId, itemName, price } = req.body;
    db.query(
      "INSERT INTO inventory (user_id, item_name, price) VALUES (?, ?, ?)",
      [userId, itemName, price],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Item added" });
      }
    );
  });

  router.get("/inventory/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM inventory WHERE user_id = ?", [userId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: results });
    });
  });

  return router;
};
