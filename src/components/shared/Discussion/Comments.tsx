import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { nanoid } from 'nanoid';

import { Comment } from '~types';
import { CommentFlags, CommentVoteTypes } from '~gql';
import { notNull } from '~utils/arrays';
import { useAppContext } from '~hooks';
import { useUserTokenBalanceContext } from '~context';

import styles from './Discussion.css';
import {
  sortByDate,
  submitVote,
  updateComments,
  updateVote,
  updateVotes,
  useDiscussion,
} from './helpers';
import CommentEdit from './CommentEdit';

const displayName = 'Comments';

interface Props {
  actionId: string;
  savedComments: Array<Comment>;
  setInReplyToId: Dispatch<SetStateAction<string | undefined>>;
}

const Comments = ({ actionId, savedComments, setInReplyToId }: Props) => {
  const { user } = useAppContext();
  const { tokenBalanceData } = useUserTokenBalanceContext();

  const [comments, setComments] = useState(sortByDate(savedComments, false));
  const [commentToEdit, setCommentToEdit] = useState<string>();

  const onDiscussionUpdate = useCallback((newMessage) => {
    // eslint-disable-next-line no-underscore-dangle
    switch (newMessage.data.__typename) {
      case 'Comment':
        setComments((cachedComments) =>
          updateComments(cachedComments, newMessage),
        );
        break;
      case 'Vote':
        setComments((cachedComments) =>
          updateVotes(cachedComments, newMessage),
        );
        break;
      default:
        console.error(`Unknown Pub sub message recieved: ${newMessage}`);
    }
  }, []);

  useDiscussion(actionId, onDiscussionUpdate);

  if (!user || !tokenBalanceData) {
    return null;
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const CommentList = ({
    cachedComments,
    depth,
  }: {
    cachedComments: Array<Comment>;
    depth: number;
  }) => (
    <ol className={styles.commentList}>
      {cachedComments.map((comment) => {
        const {
          id,
          author,
          content,
          createdAt,
          updatedAt,
          flag,
          comments: cachedChildComments,
          votes,
        } = comment;

        const authorText =
          author?.profile?.displayName ||
          author?.name ||
          author?.id ||
          'deleted';

        const editing = commentToEdit === id;

        const flagColor = (() => {
          switch (flag) {
            case CommentFlags.Support:
              return 'green';
            case CommentFlags.Oppose:
              return 'red';
            default:
              return undefined;
          }
        })();

        const childComments = cachedChildComments?.items?.filter(notNull);

        const commentVotes = votes?.items?.filter(notNull);

        const castVote = async (type: CommentVoteTypes) => {
          if (!user?.walletAddress) {
            throw new Error(
              'User wallet address needs to be defined in order to vote',
            );
          }

          const previousUserVote = commentVotes?.filter(
            (vote) => vote.voterAddress === user.walletAddress,
          )[0];

          if (previousUserVote) {
            try {
              await updateVote(actionId, {
                id: previousUserVote.id,
                type,
                amount: tokenBalanceData?.balance || '0',
              });
            } catch (error) {
              console.error(`voting failed: ${error}`);
            }
            return;
          }

          if (!tokenBalanceData?.balance) {
            console.error(
              'Should we show a message if the user has no balance with which to vote?',
            );
            return;
          }

          // Disabled for testing
          /* if (author?.id === user.walletAddress) {
                      console.log(
                        'Should we show a message if the author tries to vote on their own comment?',
                      );
                      return;
                    } */

          try {
            await submitVote(actionId, {
              commentVotesId: id,
              voterAddress: user.walletAddress,
              type,
              amount: tokenBalanceData?.balance || '0',
            });
          } catch (error) {
            console.error(`voting failed: ${error}`);
          }
        };

        const voteWeight =
          commentVotes &&
          commentVotes.reduce(
            (totalVotes, vote) =>
              vote.type === CommentVoteTypes.For
                ? totalVotes + BigInt(vote.amount)
                : totalVotes - BigInt(vote.amount),
            BigInt(0),
          );

        const voteColor =
          // eslint-disable-next-line no-nested-ternary
          !voteWeight || voteWeight === BigInt(0)
            ? undefined
            : voteWeight > BigInt(0)
            ? 'green'
            : 'red';

        return (
          <li key={nanoid()} className={styles.comment}>
            {editing ? (
              <CommentEdit
                actionId={actionId}
                commentToEdit={comment}
                setComments={setComments}
                setCommentToEdit={setCommentToEdit}
              />
            ) : (
              <div>
                <div className={styles.commentContent}>
                  <p>
                    <span
                      style={{
                        color: flagColor,
                      }}
                    >
                      {authorText}{' '}
                    </span>
                    <span className={styles.createdAtText}>{createdAt}</span>
                    <span className={styles.modifiedText}>
                      {createdAt !== updatedAt && ' Edited'}
                    </span>
                    {commentVotes && (
                      <span
                        style={{
                          color: voteColor,
                        }}
                      >
                        {' '}
                        Vote: {voteWeight?.toString() || 0}
                      </span>
                    )}
                  </p>
                  {content}
                </div>
                <button type="button" onClick={() => setCommentToEdit(id)}>
                  Edit comment
                </button>
                {depth !== 2 && (
                  <button type="button" onClick={() => setInReplyToId(id)}>
                    Reply
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => castVote(CommentVoteTypes.For)}
                >
                  Vote for
                </button>
                <button
                  type="button"
                  onClick={() => castVote(CommentVoteTypes.Against)}
                >
                  Vote against
                </button>
              </div>
            )}
            {childComments && (
              <CommentList cachedComments={childComments} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ol>
  );

  return <CommentList cachedComments={comments} depth={0} />;
};

Comments.displayName = displayName;

export default Comments;
