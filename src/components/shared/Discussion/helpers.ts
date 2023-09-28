import { useEffect } from 'react';
import { Amplify } from '@aws-amplify/core';

import { Comment, Vote } from '~types';
import { notNull } from '~utils/arrays';
import { ContextModule, getContext } from '~context';
import {
  CreateVoteDocument,
  CreateVoteInput,
  CreateVoteMutation,
  CreateVoteMutationVariables,
  UpdateVoteDocument,
  UpdateVoteInput,
  UpdateVoteMutation,
  UpdateVoteMutationVariables,
} from '~gql';

// @ts-ignore
import { config as AWS_CONFIG, subscribe, publish } from './generated';

Amplify.configure({
  ...AWS_CONFIG,
  // eslint-disable-next-line camelcase
  aws_appsync_apiKey: process.env.PUB_SUB_API_KEY,
});

export function useDiscussion(
  id: string,
  onNewMessage: (comment: Comment) => void,
) {
  useEffect(() => {
    // Subscribe via WebSockets
    const subscription = subscribe(id, async ({ data }: { data: any }) => {
      const newMessage = JSON.parse(data);

      if (newMessage) {
        onNewMessage(newMessage);
      }
    });

    return () => subscription.unsubscribe();
  }, [id, onNewMessage]);
}

export async function getIpAddress() {
  try {
    // Use the ipify API to determine the user's public IP address
    const response = await fetch('https://api.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();
      return data.ip as string;
    }
    console.error('Request failed', response.status, response.statusText);
    return '';
  } catch (error) {
    console.error('An error occurred while fetching the IP address', error);
    return '';
  }
}

export const sortByDate = (
  comments: Comment[],
  latestFirst = false,
): Comment[] => {
  // Choose the subtraction order based on the flag latestFirst.
  const newComments = [...comments].sort((a, b) =>
    latestFirst
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Use map to create a new array of comments with sorted nested comments.
  return newComments.map((comment) => {
    // If there are nested comments, sort them recursively.
    if (comment.comments && comment.comments.items.length > 0) {
      return {
        ...comment,
        comments: {
          ...comment.comments,
          items: sortByDate(
            comment?.comments?.items?.filter(notNull),
            latestFirst,
          ),
        },
      };
    }
    return { ...comment }; // Return a new comment object to avoid modifying the original.
  });
};

export const submitVote = async (
  actionId: string,
  vote: Required<Pick<CreateVoteInput, 'commentVotesId'>> &
    Omit<CreateVoteInput, 'commentVotesId'>,
) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  await apolloClient.mutate<CreateVoteMutation, CreateVoteMutationVariables>({
    mutation: CreateVoteDocument,
    variables: {
      input: {
        ...vote,
      },
    },
  });

  await publish(
    actionId,
    JSON.stringify({ action: 'create', data: { ...vote, __typename: 'Vote' } }),
  );
};

export const updateVote = async (
  actionId: string,
  vote: Required<Pick<UpdateVoteInput, 'amount' | 'id' | 'type'>>,
) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  await apolloClient.mutate<UpdateVoteMutation, UpdateVoteMutationVariables>({
    mutation: UpdateVoteDocument,
    variables: {
      input: {
        ...vote,
      },
    },
  });

  await publish(
    actionId,
    JSON.stringify({ action: 'update', data: { ...vote, __typename: 'Vote' } }),
  );
};

const updateComment = (cachedComment: Comment, updatedComment: Comment) => {
  const targetId = updatedComment.id;

  if (cachedComment?.id === targetId) {
    return {
      ...cachedComment,
      ...updatedComment,
    };
  }

  const childComments = cachedComment?.comments?.items?.filter(notNull);

  if (childComments) {
    return {
      ...cachedComment,
      comments: {
        ...cachedComment.comments,
        items: childComments.map((item) => updateComment(item, updatedComment)),
      },
    };
  }

  return cachedComment;
};

function addComment(parentComment: Comment, newComment: Comment) {
  // Base case: if the current item is the one we're looking for, add the comment.
  if (parentComment.id === newComment.commentCommentsId) {
    const newItems = parentComment.comments?.items
      ? [...parentComment.comments.items, newComment]
      : [newComment];
    return {
      ...parentComment,
      comments: {
        ...parentComment.comments,
        items: newItems,
      },
    };
  }

  const childComment = parentComment?.comments?.items?.filter(notNull);

  // Recursive case: if the item has comments, search each comment.
  if (childComment) {
    return {
      ...parentComment,
      comments: {
        ...parentComment.comments,
        items: childComment.map((comment) => addComment(comment, newComment)),
      },
    };
  }

  // If the item is not the one we're looking for and has no comments, return it unmodified.
  return parentComment;
}

// NOTE: At some point this will need to take into account the selected sorting method
export const updateComments = (
  cachedComments: Array<Comment>,
  message: {
    data: Comment;
    action: 'create' | 'edit';
  },
): Array<Comment> => {
  const { data, action } = message;

  if (action === 'edit') {
    return [...cachedComments.map((comment) => updateComment(comment, data))];
  }

  if (!message.data.commentCommentsId) {
    return [...cachedComments, data];
  }

  return [...cachedComments.map((comment) => addComment(comment, data))];
};

export const updateVotes = (
  cachedComments: Array<Comment>,
  message: {
    data: Vote;
    action: 'create' | 'edit';
  },
): Array<Comment> => {
  console.warn(`Implement updating votes: ${message}`);

  return cachedComments;
};
