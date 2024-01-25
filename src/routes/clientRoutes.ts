import express from 'express';
import { addClient, listClients } from '../controllers/clientController';


const router = express.Router();

router.get('/clients', listClients);
router.post('/clients', addClient);

export default router;