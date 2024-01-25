import express from 'express';
import { addClient, listClients } from './controllers/clientController';


const app = express();
app.use(express.json());

app.get('/clients', listClients);
app.post('/clients', addClient);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
