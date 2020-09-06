import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const events = [];

const URL_POSTS_SERVICE = 'http://posts-clusterip-srv:4000';
const URL_COMMENTS_SERVICE = 'http://comments-srv:4001';
const URL_QUERY_SERVICE = 'http://query-srv:4002';
const URL_MODERATION_SERVICE = 'http://moderation-srv:4003';

// INCOMING events
app.post('/events', async (req, res) => {
  const event = req.body;

  // persist events. Most recent event is at the end of the array
  events.push(event);

  // broadcast all activity to all services
  await axios.post(`${URL_POSTS_SERVICE}/events`, event);
  // axios.post(`${URL_COMMENTS_SERVICE}/events`, event);
  // axios.post(`${URL_QUERY_SERVICE}/events`, event);
  // axios.post(`${URL_MODERATION_SERVICE}/events`, event);

  console.log('Event Bus received and emitted event', req.body.type);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event Bus (v 0.0.3) listening on port 4005');
});
