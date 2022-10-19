import { ContextModule, getContext } from '~context';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from '~data/index';
import { Address } from '~types';

export function* updateColonyDisplayCache(
  colonyAddress: Address,
  displayName: string | null,
  avatarHash: string | null,
  avatarURL: string | null,
) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const {
    data: { processedColony },
  } = yield apolloClient.query<
    ProcessedColonyQuery,
    ProcessedColonyQueryVariables
  >({
    query: ProcessedColonyDocument,
    variables: {
      address: colonyAddress,
    },
    fetchPolicy: 'network-only',
  });

  apolloClient.cache.modify({
    id: apolloClient.cache.identify(processedColony),
    fields: {
      /*
       * @NOTE Only return the value that you want to be set in the cache
       * Any value you return will be set immediatly
       *
       * That's why we can't have a consistent return
       */
      // eslint-disable-next-line consistent-return
      displayName: () => {
        if (displayName || displayName === null) {
          return displayName;
        }
      },
      // eslint-disable-next-line consistent-return
      avatarHash: () => {
        if (avatarHash || avatarHash === null) {
          return avatarHash;
        }
      },
      // eslint-disable-next-line consistent-return
      avatarURL: () => {
        if (avatarURL || avatarURL === null) {
          return avatarURL;
        }
      },
    },
  });
}
