import React from 'react';
import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import { DeepPartial } from 'utility-types';
import {
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
} from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { MintTokenFormValues } from './consts';
import Numeral from '~shared/Numeral';
import UserPopover from '~v5/shared/UserPopover';

const getAmountText = async (
  amount: number | undefined,
  tokenId: string | undefined,
  client: ApolloClient<object>,
): Promise<React.ReactNode> => {
  try {
    if (!amount || !tokenId) {
      return 'native';
    }

    const { data } = await client.query<
      GetTokenByAddressQuery,
      GetTokenByAddressQueryVariables
    >({
      query: GetTokenByAddressDocument,
      variables: { address: tokenId },
    });

    const tokenSymbol = first(data?.getTokenByAddress?.items)?.symbol;

    if (!tokenSymbol) {
      return (
        <>
          <Numeral value={amount} /> native tokens
        </>
      );
    }

    return (
      <>
        <Numeral value={amount} /> {tokenSymbol}
      </>
    );
  } catch {
    return 'native';
  }
};

export const mintTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<MintTokenFormValues>
> = async ({ amount }, { client, currentUser, colony }) => {
  return (
    <>
      Mint{' '}
      {await getAmountText(
        amount?.amount,
        colony?.nativeToken.tokenAddress,
        client,
      )}{' '}
      tokens
      {currentUser?.profile?.displayName && (
        <>
          {' '}
          by{' '}
          <UserPopover
            userName={currentUser?.profile?.displayName}
            walletAddress={currentUser.walletAddress}
            aboutDescription={currentUser.profile?.bio || ''}
            user={currentUser}
          >
            <span className="text-gray-900">
              {currentUser.profile.displayName}
            </span>
          </UserPopover>
        </>
      )}
    </>
  );
};
