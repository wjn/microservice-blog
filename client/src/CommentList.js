import React from 'react';

export default ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    switch (comment.status) {
      case 'approved':
        content = comment.content;
        break;
      case 'rejected':
        content = 'Comment has been rejected by the moderator.';
        break;
      default:
        content = 'Comment is pending moderation.';
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
