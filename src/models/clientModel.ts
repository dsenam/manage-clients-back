const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getClients(
  name?: string | string[],
  email?: string,
  phone?: string
) {
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

  return await pool.query(query, params);
}

export async function createClient(
  name: string,
  email: string,
  phone: string,
  coordinate_x: string,
  coordinate_y: string
) {
  const query =
    "INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const params = [name, email, phone, coordinate_x, coordinate_y];

  return await pool.query(query, params);
}
