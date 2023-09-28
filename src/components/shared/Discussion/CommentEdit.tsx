import React, { Dispatch, SetStateAction, useState } from 'react';

import { useSubmitCommentMutation } from '~gql';
import { Comment } from '~types';

import styles from './Discussion.css';

const displayName = 'CommentEdit';

interface Props {
  actionId: string;
  commentToEdit: Comment;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  setCommentToEdit: Dispatch<SetStateAction<string | undefined>>;
}

const CommentEdit = ({
  actionId,
  commentToEdit,
  setComments,
  setCommentToEdit,
}: Props) => {
  const [content, setContent] = useState(commentToEdit.content);
  const [submitComment] = useSubmitCommentMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content) {
      return;
    }

    await submitComment({
      variables: {
        input: {
          actionId,
          commentId: commentToEdit.id,
          content,
        },
      },
    });

    setComments((comments) =>
      comments.map((comment) => {
        if (comment.id === commentToEdit.id) {
          return {
            ...comment,
            updatedAt: new Date().toISOString(),
            // NOTE: Chaning flag state still needs to be implemented
            content,
          };
        }
        // No changes
        return comment;
      }),
    );

    setCommentToEdit(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editComment}>
      <input
        type="text"
        value={content || ''}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

CommentEdit.displayName = displayName;

export default CommentEdit;
