import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello Vicky, you are the great person');
});

export default router;
