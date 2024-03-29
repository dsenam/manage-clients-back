import express from 'express';
import router from './routes/clientRoutes';


const app = express();
app.use(express.json());

app.use('/api', router);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
