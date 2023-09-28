const { default: fetch, Request } = require('node-fetch');

const {
  getDiscussion,
  createDiscussion,
  createComment,
  updateComment,
} = require('./graphql');
const { graphqlRequest } = require('./utils');
const { perspectiveFilter, akismetFilter } = require('./filters');

let perspectiveApiKey;
let akismetApiKey;
let channelGraphqlEndpoint;
let channelApiKey;

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
    const { getParams } = require('/opt/nodejs/getParams');
    [
      perspectiveApiKey,
      akismetApiKey,
      channelGraphqlEndpoint,
      channelApiKey,
      apiKey,
      graphqlURL,
    ] = await getParams([
      'perspectiveApiKey',
      'akismetApiKey',
      'channelGraphqlEndpoint',
      'channelApiKey',
      'appsyncApiKey',
      'graphqlUrl',
    ]);
  }
};

async function addCommentToDatabase(
  actionId,
  authorAddress,
  content,
  flag,
  parentId,
) {
  const discussion = await graphqlRequest(
    getDiscussion,
    {
      id: actionId,
    },
    apiKey,
    graphqlURL,
  );

  // Check if dicussion exists
  if (!discussion.data.getDiscussion) {
    const discussionMutation = await graphqlRequest(
      createDiscussion,
      {
        input: {
          id: actionId,
        },
      },
      apiKey,
      graphqlURL,
    );

    if (discussionMutation.errors || !discussionMutation.data) {
      const [error] = discussionMutation.errors;
      throw new Error(
        error?.message ||
          `Could not create discussion on transactionHash "${id}"`,
      );
    }
  }

  const commentMutation = await graphqlRequest(
    createComment,
    {
      input: {
        content,
        authorAddress,
        flag,
        ...(parentId
          ? { commentCommentsId: parentId }
          : { discussionCommentsId: actionId }),
      },
    },
    apiKey,
    graphqlURL,
  );

  if (commentMutation.errors || !commentMutation.data) {
    const [error] = commentMutation.errors;
    throw new Error(
      error?.message || `Could not create comment on transactionHash "${id}"`,
    );
  }

  return commentMutation.data.createComment;
}

async function updateCommentInDatabase(commentId, content, flag) {
  const commentMutation = await graphqlRequest(
    updateComment,
    {
      input: {
        id: commentId,
        content,
        flag,
      },
    },
    apiKey,
    graphqlURL,
  );

  if (commentMutation.errors || !commentMutation.data) {
    const [error] = commentMutation.errors;
    throw new Error(
      error?.message || `Could not update comment: "${commentId}"`,
    );
  }

  return commentMutation.data.updateComment;
}

async function publishToChannel(actionId, comment, commentId) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': channelApiKey,
  };

  const query = `
        mutation PublishData($data: AWSJSON!, $name: String!) {
            publish(data: $data, name: $name) {
                data
                name
            }
        }`;

  const variables = {
    name: actionId,
    data: JSON.stringify({
      data: comment,
      action: commentId ? 'edit' : 'create',
    }),
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const request = new Request(channelGraphqlEndpoint, options);
  const response = await fetch(request);

  if (response.ok) {
    const result = await response.json();

    console.log('Pub sub response:', result);
  } else {
    throw new Error('Something went wrong');
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const {
    actionId,
    authorAddress,
    content,
    ipAddress,
    userAgent,
    commentId,
    flag,
    parentId,
  } = event.arguments?.input || {};

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  try {
    await perspectiveFilter(content, perspectiveApiKey);
    await akismetFilter(actionId, content, ipAddress, userAgent, akismetApiKey);

    const comment = !commentId
      ? await addCommentToDatabase(
          actionId,
          authorAddress,
          content,
          flag,
          parentId,
        )
      : await updateCommentInDatabase(commentId, content, flag);

    await publishToChannel(actionId, comment, commentId);
  } catch (error) {
    console.error('Error:', error);
  }

  return {
    accepted: true,
  };
};
