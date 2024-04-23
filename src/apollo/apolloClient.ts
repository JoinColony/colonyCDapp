import { ApolloClient, ApolloLink, from } from '@apollo/client';
import { createAuthLink, AUTH_TYPE } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

import cache from './cache/index.ts';
import removeTypenameLink from './removeTypenameLink.ts';

const noAuth = {
  type: AUTH_TYPE.NONE as const,
};

const httpLink = createAuthLink({
  url: `${
    import.meta.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'
  }/graphql`,
  region: 'us-east-1',
  // auth is handled by auth proxy
  auth: noAuth,
});

const subscriptionLink = createSubscriptionHandshakeLink({
  url: `${
    import.meta.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'
  }/graphql`,
  region: 'us-east-1',
  // auth is handled by auth proxy
  auth: noAuth,
});

// Middleware link for setting credentials to include (aws links do not do that!)
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    // ensures cookies are sent with every request
    credentials: 'include',
  });

  return forward(operation);
});

const apolloClient = new ApolloClient({
  cache,
  connectToDevTools: true,
  link: from([removeTypenameLink, authLink, httpLink, subscriptionLink]),
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});

export default apolloClient;
