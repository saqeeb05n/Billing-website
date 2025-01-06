const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Middleware to validate request body for POST /store
  const validateStoreData = (req, res, next) => {
    const { userId, name, phone, address, logo } = req.body;
    if (!userId || !name || !phone || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields except logo are required" });
    }
    next();
  };

  // Save store details
  router.post("/store", validateStoreData, (req, res) => {
    const { userId, name, phone, address, logo } = req.body;
  
    const query = `
      INSERT INTO stores (user_id, name, phone, address, logo)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        phone = VALUES(phone),
        address = VALUES(address),
        logo = VALUES(logo)
    `;
  
    db.query(query, [userId, name, phone, address, logo || null], (err) => {
      if (err) {
        console.error("Error saving/updating store:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to save/update store details" });
      }
      res.json({ success: true, message: "Store details saved/updated" });
    });
});
  

  // Fetch store details by user ID
  router.get("/store/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM stores WHERE user_id = ?";

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching store:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to fetch store details" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Store not found for this user ID" });
      }
      res.json({ success: true, data: results });
    });
  });

  return router;
};
