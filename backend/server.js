const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/store");
const inventoryRoutes = require("./routes/inventory");
const invoiceRoutes = require("./routes/invoice");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "billing",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

app.use("/api", authRoutes(db));
app.use("/api", storeRoutes(db));
app.use("/api", inventoryRoutes(db));
app.use("/api", invoiceRoutes(db));

app.listen(5000, () => console.log("Server running on port 5000"));
