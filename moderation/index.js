import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const URL_EVENT_BUS = 'http://event-bus-srv:4005';

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post(`${URL_EVENT_BUS}/events`, {
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
