import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import {
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { Address, Colony, Domain } from '~types';

export const tryGetToken = async (
  tokenAddress: Address | undefined,
  client: ApolloClient<object>,
  colony: Colony,
) => {
  if (!tokenAddress) {
    return undefined;
  }

  try {
    const matchingColonyToken = colony.tokens?.items.find(
      (colonyToken) => colonyToken?.token?.tokenAddress === tokenAddress,
    );

    if (matchingColonyToken) {
      return matchingColonyToken.token;
    }

    const { data } = await client.query<
      GetTokenByAddressQuery,
      GetTokenByAddressQueryVariables
    >({
      query: GetTokenByAddressDocument,
      variables: { address: tokenAddress },
    });

    return first(data?.getTokenByAddress?.items);
  } catch {
    return undefined;
  }
};

export const getTeam = (
  teamId: string | number | undefined,
  colony: Colony | undefined,
): Domain | undefined =>
  colony?.domains?.items.find(
    (domain) => domain?.nativeId === Number(teamId),
  ) || undefined;

export const tryGetUser = async (
  userAddress: Address | undefined,
  client: ApolloClient<object>,
) => {
  if (!userAddress) {
    return undefined;
  }

  try {
    const { data } = await client.query<
      GetUserByAddressQuery,
      GetUserByAddressQueryVariables
    >({
      query: GetUserByAddressDocument,
      variables: { address: userAddress },
    });

    return first(data?.getUserByAddress?.items) || null;
  } catch {
    return undefined;
  }
};
