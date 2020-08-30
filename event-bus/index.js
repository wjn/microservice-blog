import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const urlPostService = 'http://localhost:4000';
const urlCommentsService = 'http://localhost:4001';
const urlQueryService = 'http://localhost:4002';

app.post('/events', (req, res) => {
  const event = req.body;

  // broadcast all activity to all services
  axios.post(`${urlCommentsService}/events`, event);
  axios.post(`${urlPostService}/events`, event);
  axios.post(`${urlQueryService}/events`, event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event Bus listening on port 4005');
});
