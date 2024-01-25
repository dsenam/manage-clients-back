const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/clients", async (req, res) => {
  const result = await pool.query("SELECT * FROM clients");
  res.json(result.rows);
});

app.post("/clients", async (req, res) => {
  const { name, email, phone, coordinate_x, coordinate_y } = req.body;
  const result = await pool.query(
    "INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, phone, coordinate_x, coordinate_y]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
