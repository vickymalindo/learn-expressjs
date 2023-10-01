import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import db from './config/Database.js';
import router from './routes/index.js';

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log('Database Connected');
} catch (error) {
  console.error(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(router);
app.use(cors);

app.listen(3000, () => console.log('server run on port 3000'));
