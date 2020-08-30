import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body;

  // broadcast all activity to all services
  axios.post(`${process.env.URL_COMMENTS_SERVICE}/events`, event);
  axios.post(`${process.env.URL_POSTS_SERVICE}/events`, event);
  axios.post(`${process.env.URL_QUERY_SERVICE}/events`, event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event Bus listening on port 4005');
});
