const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface IClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  coordinate_x: number;
  coordinate_y: number;
}

export interface IPoint {
  coordinate_x: number;
  coordinate_y: number;
}

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
  name: IClient["name"],
  email: IClient["email"],
  phone: IClient["phone"],
  coordinate_x: IClient["coordinate_x"],
  coordinate_y: IClient["coordinate_y"]
) {
  const query =
    "INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const params = [name, email, phone, coordinate_x, coordinate_y];

  return await pool.query(query, params);
}

export function calculateDistance(point1: IPoint, point2: IPoint) {
  let positionX = point2.coordinate_x - point1.coordinate_x;
  let positionY = point2.coordinate_y - point1.coordinate_y;
  let result = Math.sqrt(positionX * positionX + positionY * positionY);
  return result;
}

export async function getClientByEmail(email: string) {
  const query = "SELECT * FROM clients WHERE email = $1";
  const params = [email];

  return await pool.query(query, params);
}
