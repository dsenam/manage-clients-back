import express from 'express';
import { addClient, listClients, listClientsByProximity } from '../controllers/clientController';


const router = express.Router();

router.get('/clients', listClients);
router.post('/clients', addClient);
router.get('/clients-proximity', listClientsByProximity);

export default router;