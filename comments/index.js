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

const commentsByPostId = {};

// TODO: remove as unneeded with query service
// send all comments for a given post
// app.get('/posts/:id/comments', (req, res) => {
//   res.send(commentsByPostId[req.params.id] || []);
// });

// create new comment for a post
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = trim(req.body);

  // no blank comments
  if (!content) {
    return;
  }

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  // send processed comment to the event bus
  await axios.post(`${process.env.URL_EVENT_BUS}/events`, {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

// end point to receive events from Event Bus
app.post('/events', (req, res) => {
  console.log('Comments Service received event', req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log('Comments Service listening on port 4001');
});
