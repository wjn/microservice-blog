import express from 'express';
import { randomBytes } from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

const URL_EVENT_BUS = 'http://event-bus-srv:4005';

// ==================================================
// TODO: remove as unneeded with query service
// --------------------------------------------------
// send all comments for a given post
// app.get('/posts/:id/comments', (req, res) => {
//   res.send(commentsByPostId[req.params.id] || []);
// });
// ==================================================

// create new comment for a post
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  content.trim();
  // no blank comments
  if (!content) {
    return;
  }

  const comments = commentsByPostId[req.params.id] || [];

  // by default all new comments have a staus of pending (moderation)
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  // send created comment to the event bus
  await axios.post(`${URL_EVENT_BUS}/events`, {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      status: 'pending',
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

// end point to receive INCOMING events from Event Bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios.post(`${URL_EVENT_BUS}/events`, {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  console.log('Comments Service received event', type);
  res.send({ status: 'OK' });
});

app.listen(4001, () => {
  console.log('Comments Service listening on port 4001');
});
