import { ApolloClient, HttpLink } from '@apollo/client';

import cache from '~cache';

const httpLink = new HttpLink({
  uri: `${process.env.AUTH_PROXY_ENDPOINT || 'http://localhost:3005'}/graphql`,
  credentials: 'include',
});

export default new ApolloClient({
  link: httpLink,
  connectToDevTools: true,
  cache,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});
