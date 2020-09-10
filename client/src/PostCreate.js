import React, { useState } from 'react';
import axios from 'axios';

export default () => {
  const [title, setTitle] = useState('');

  const URL_POSTS_SERVICE = 'http://wjn-k8s-posts.com';

  const onSubmit = async (event) => {
    event.preventDefault();

    // send new post to Post Service
    await axios.post(`${URL_POSTS_SERVICE}/posts/create`, {
      title,
    });

    setTitle('');
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
