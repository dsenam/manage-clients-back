import { Request, Response } from "express";
import {
  IClient,
  calculateDistance,
  createClient,
  getClientByEmail,
  getClients,
} from "../models/clientModel";
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
    const existingClient = await getClientByEmail(email);
    if (existingClient.rows.length > 0) {
      res.status(400).json({ error: errorMessages.emailAlreadyUse});
      return;
    }

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

export async function listClientsByProximity(req: Request, res: Response) {
  try {
    let clients = await getClients();
    clients.rows.sort((clientA: IClient, clientB: IClient) => {
      let distA = calculateDistance(
        { coordinate_x: 0, coordinate_y: 0 },
        clientA
      );
      let distB = calculateDistance(
        { coordinate_x: 0, coordinate_y: 0 },
        clientB
      );
      return distA - distB;
    });

    res.json(clients.rows);
  } catch (err) {
    res.status(500).json({ error: errorMessages.listClients });
  }
}
