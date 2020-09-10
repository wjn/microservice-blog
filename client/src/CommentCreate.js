import React, { useState } from 'react';
import axios from 'axios';
export default ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    const URL_COMMENTS_SERVICE = 'http://wjn-k8s-posts.com';

    // send new comments to comments service
    await axios.post(`${URL_COMMENTS_SERVICE}/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
