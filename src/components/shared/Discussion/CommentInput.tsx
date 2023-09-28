import React, { useState } from 'react';

import { useSubmitCommentMutation, CommentFlags } from '~gql';
import { useAppContext } from '~hooks';

import styles from './Discussion.css';
import { getIpAddress } from './helpers';

const displayName = 'CommentInput';

interface Props {
  actionId: string;
  parentId: string | undefined;
}

const CommentInput = ({ actionId, parentId }: Props) => {
  const [comment, setComment] = useState('');
  const [flag, setFlag] = useState<CommentFlags>();
  const [submitComment] = useSubmitCommentMutation();
  const { wallet } = useAppContext();
  const walletAddress = wallet?.address || '';

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ipAddress = await getIpAddress();

    await submitComment({
      variables: {
        input: {
          actionId,
          authorAddress: walletAddress,
          content: comment,
          ipAddress,
          userAgent: navigator.userAgent,
          ...(flag ? { flag } : {}),
          ...(parentId ? { parentId } : {}),
        },
      },
    });
    setComment('');
    setFlag(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.submitForm}>
      {parentId && <p>Replying to {parentId}</p>}
      <div className={styles.submitContainer}>
        <div>
          Support{' '}
          <input
            type="checkbox"
            id="support"
            checked={flag === CommentFlags.Support}
            onChange={() => {
              const newState =
                flag !== CommentFlags.Support
                  ? CommentFlags.Support
                  : undefined;
              setFlag(newState);
            }}
          />
          Oppose{' '}
          <input
            type="checkbox"
            id="oppose"
            checked={flag === CommentFlags.Oppose}
            onChange={() => {
              const newState =
                flag !== CommentFlags.Oppose ? CommentFlags.Oppose : undefined;
              setFlag(newState);
            }}
          />
        </div>
        <textarea
          id="textArea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.submitTextArea}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

CommentInput.displayName = displayName;

export default CommentInput;
