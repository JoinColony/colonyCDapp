import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

const {
  AWS_APPSYNC_GRAPHQL_URL = '',
  AWS_APPSYNC_REGION = '',
  AWS_APPSYNC_AUTH_TYPE = '',
  AWS_APPSYNC_API_KEY = '',
} = process.env;

const auth = {
  type: AWS_APPSYNC_AUTH_TYPE as string,
  apiKey: AWS_APPSYNC_API_KEY,
};

const connectionConfig = {
  url: AWS_APPSYNC_GRAPHQL_URL,
  region: AWS_APPSYNC_REGION,
  auth,
};

const httpLink = new HttpLink({
  uri: AWS_APPSYNC_GRAPHQL_URL,
});

const link = ApolloLink.from([
  // @ts-ignore
  createAuthLink(connectionConfig),
  // @ts-ignore
  createSubscriptionHandshakeLink(connectionConfig, httpLink),
]);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
