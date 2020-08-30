import express from 'express';
import { randomBytes } from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// endpoint for providing all posts in memory
app.get('/posts', (req, res) => {
  res.send(posts);
});

// endpoint for receiving new posts
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  // post to Event Bus
  await axios.post(`${process.env.URL_EVENT_BUS}/events`, {
    type: 'PostCreated',
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

// endpoint to receive events from the event bus
app.post('/events', (req, res) => {
  console.log('Post Service received event', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('Posts Service listening on port 4000');
});
