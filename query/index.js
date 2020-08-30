import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// endpoint to provide all aggregated posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

// endpoint to receive events emmitted from event buss
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  // process new posts
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  // process new comments
  if (type === 'CommentCreated') {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  res.send({});
});

app.listen(4002, () => {
  console.log('Query Service listening on port 4002');
});
