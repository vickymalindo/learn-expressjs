import express from 'express';
import db from './config/Database.js';
import router from './routes/index.js';
const app = express();

try {
  await db.authenticate();
  console.log('Database Connected');
} catch (error) {
  console.error(error);
}

app.use(express.json());
app.use(router);

// app.get('/', function (req, res) {
//   res.send('Hello Vicky, you are the great person');
// });

app.listen(3000, () => console.log('server run on port 3000'));
