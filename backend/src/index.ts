import dotenv from 'dotenv';
import app from './app';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const port = process.env.BACKEND_PORT ?? '3000';
app.listen(port, () => console.log(`Server started on port ${port}`));
