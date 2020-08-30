import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case 'CommentCreated': {
      const { id, content, status, postId } = data;
      const post = posts[postId];
      // rewrites comments array based on the array of comments received
      post.comments.push({ id, content, status });

      break;
    }
    case 'CommentUpdated': {
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

      break;
    }
    default:
      return;
  }
};

// endpoint to provide all aggregated posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

// endpoint to receive INCOMING events emmitted from event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  console.log('Query Service received event', type);

  res.send({ status: 'OK' });
});

app.listen(4002, async () => {
  console.log('Query Service listening on port 4002');

  const res = await axios.get(`${process.env.URL_EVENT_BUS}/events`);

  for (let event of res.data) {
    console.log(`Query Services is processing a(n) ${event.type} event`);
    handleEvent(event.type, event.data);
  }
});
