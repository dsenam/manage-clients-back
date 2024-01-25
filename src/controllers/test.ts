import request from "supertest";
import express from "express";
import { listClients, addClient } from "./clientController";
import * as clientModel from "../models/clientModel";

jest.mock("../models/clientModel");

const mockedClientModel = clientModel as jest.Mocked<typeof clientModel>;

const app = express();
app.use(express.json());
app.get("/clients", listClients);
app.post("/clients", addClient);

describe('Client Controller', () => {
    it('should list clients', async () => {
      mockedClientModel.getClients.mockResolvedValue({
        rows: [{ id: 1, name: 'Test Client', email: 'test@client.com', phone: '123456789', coordinate_x: 10, coordinate_y: 20 }],
      });
  
      const res = await request(app).get('/clients');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    it('should create a new client', async () => {
      mockedClientModel.createClient.mockResolvedValue({
        rows: [{ id: 1, name: 'Test Client', email: 'test@client.com', phone: '123456789', coordinate_x: 10, coordinate_y: 20 }],
      });
  
      const res = await request(app)
        .post('/clients')
        .send({
          name: 'Test Client',
          email: 'test@client.com',
          phone: '123456789',
          coordinate_x: 10,
          coordinate_y: 20,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
    });
  
    it('should handle errors in listClients', async () => {
      mockedClientModel.getClients.mockRejectedValue(new Error('Test error'));
  
      const res = await request(app).get('/clients');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Erro ao listar clientes' });
    });
  
    it('should handle errors in addClient', async () => {
      mockedClientModel.createClient.mockRejectedValue(new Error('Test error'));
  
      const res = await request(app)
        .post('/clients')
        .send({
          name: 'Test Client',
          email: 'test@client.com',
          phone: '123456789',
          coordinate_x: 10,
          coordinate_y: 20,
        });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Erro ao adicionar cliente' });
    });

    it('should return 400 if a field is missing', async () => {
        const res = await request(app)
          .post('/clients')
          .send({
            name: 'Test Client',
            email: 'test@client.com',
            phone: '123456789',
            
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Todos os campos são obrigatórios' });
      });
  });
