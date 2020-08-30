import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// endpoint to provide all aggregated posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

// endpoint to receive INCOMING events emmitted from event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  // process new posts
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  // process new comments
  if (type === 'CommentCreated') {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    // rewrites comments array based on the array of comments received
    post.comments.push({ id, content, status });
  }

  // process UPDATED comments
  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    console.log(
      `Query Service updated comment status from ${comment.status} to ${status}`
    );

    comment.status = status;
    comment.content = content;
  }

  console.log('Query Service received event', type);

  res.send({ status: 'OK' });
});

app.listen(4002, () => {
  console.log('Query Service listening on port 4002');
});
