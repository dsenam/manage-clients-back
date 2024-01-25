import { Request, Response } from "express";
import { createClient, getClients } from "../models/clientModel";
import { errorMessages } from "../constants/errorMessages";

export async function listClients(req: Request, res: Response) {
  const name = req.query.name as string;
  const email = req.query.email as string;
  const phone = req.query.phone as string;

  try {
    const result = await getClients(name, email, phone);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: errorMessages.listClients });
  }
}

export async function addClient(req: Request, res: Response) {
  const { name, email, phone, coordinate_x, coordinate_y } = req.body;

  if (!name || !email || !phone || !coordinate_x || !coordinate_y) {
    res.status(400).json({ error: errorMessages.missingFields });
    return;
  }

  try {
    const result = await createClient(
      name,
      email,
      phone,
      coordinate_x,
      coordinate_y
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: errorMessages.addClient });
  }
}
