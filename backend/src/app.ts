import express from 'express';
import cors from 'cors';
import login from './controllers/login';
import { getMovements, postMovements } from './controllers/movements';
import { verifyToken } from './middleware/auth';

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(verifyToken);
app.post('/login', login);
app.get('/movements', getMovements);
app.post('/movements', postMovements);

export default app;
