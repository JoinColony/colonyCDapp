import { ApolloClient, HttpLink } from '@apollo/client';

import cache from '~cache';

/*
 * @TODO This needs to be fetched from a proper location
 */
const httpLink = new HttpLink({
  uri: process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql',
  headers: {
    'x-api-key': process.env.AWS_APPSYNC_KEY || 'da2-fakeApiId123456',
  },
});

export default new ApolloClient({
  link: httpLink,
  connectToDevTools: true,
  cache,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});
