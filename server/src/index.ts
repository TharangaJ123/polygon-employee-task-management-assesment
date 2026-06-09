import express, { type Request, type Response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_tasks_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

import authRoutes from './routes/authRoutes.js';

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
