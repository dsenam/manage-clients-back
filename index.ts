import { StatusErrorResponse } from "firebase-admin/lib/machine-learning/machine-learning-api-client";

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface IReqGetClients {
  query: {
    name: string;
    email: string;
    phone: string;
  };
}

interface IResClients {
  status: any;
  json: (arg0: any) => void;
}

interface IPostClient {
  body: {
    name: string;
    email: string;
    phone: string;
    coordinate_x: any;
    coordinate_y: any;
  };
}

app.get("/clients", async (req: IReqGetClients, res: IResClients) => {
  const { name, email, phone } = req.query;

  let query = "SELECT * FROM clients";
  let params = [];

  if (name || email || phone) {
    const conditions = [];

    if (name) {
      conditions.push("name = $" + (conditions.length + 1));
      params.push(name);
    }

    if (email) {
      conditions.push("email = $" + (conditions.length + 1));
      params.push(email);
    }

    if (phone) {
      conditions.push("phone = $" + (conditions.length + 1));
      params.push(phone);
    }

    query += " WHERE " + conditions.join(" AND ");
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
});

app.post("/clients", async (req: IPostClient, res: IResClients) => {
  const { name, email, phone, coordinate_x, coordinate_y } = req.body;

  if (!name || !email || !phone || !coordinate_x || !coordinate_y) {
    res.status(400).json({ error: "Todos os campos são obrigatórios" });
    return;
  }

  const result = await pool.query(
    "INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, phone, coordinate_x, coordinate_y]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
