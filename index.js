import express from 'express';
const app = express();

app.get('/', function (req, res) {
  res.send('Hello Vicky, you are the great person');
});

app.listen(3000);
