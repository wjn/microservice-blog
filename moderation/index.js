import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post(`${process.env.URL_EVENT_BUS}/events`, {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  console.log('Moderation Service received event', type);

  res.send({ status: 'OK' });
});

app.listen(4003, () => {
  console.log('Moderation Service listening on port 4003');
});
