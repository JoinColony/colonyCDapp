import React, { useState } from 'react';

import { ColonyAction } from '~types';
import { notNull } from '~utils/arrays';

import CommentInput from './CommentInput';
import Comments from './Comments';
import styles from './Discussion.css';

interface Props {
  actionData: ColonyAction;
}

const displayName = 'Discussion';

const Discussion = ({ actionData: { discussion, transactionHash } }: Props) => {
  const savedComments = discussion?.comments?.items?.filter(notNull) || [];
  const [inReplyToId, setInReplyToId] = useState<string>();

  return (
    <div className={styles.container}>
      <Comments
        actionId={transactionHash}
        savedComments={savedComments}
        setInReplyToId={setInReplyToId}
      />
      <CommentInput
        actionId={transactionHash}
        parentId={inReplyToId}
        setInReplyToId={setInReplyToId}
      />
    </div>
  );
};

Discussion.displayName = displayName;

export default Discussion;
