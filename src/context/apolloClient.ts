import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

/*
 * @TODO This needs to be fetched from a proper location
 */
const httpLink = new HttpLink({
  uri: 'http://localhost:20002/graphql',
  headers: {
    'x-api-key': 'da2-fakeApiId123456',
  },
});

export default new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  /*
   * @TODO Most likely we'll need to add resolvers here as well
   */
});
