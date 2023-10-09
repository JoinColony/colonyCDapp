import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import React from 'react';
import { DeepPartial } from 'utility-types';
import {
  ColonyFragment,
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
} from '~gql';
import Numeral from '~shared/Numeral';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { TransferFundsFormValues } from './consts';

const getTeamName = (
  teamId: string | undefined,
  colony: ColonyFragment | undefined,
): string | undefined =>
  colony?.domains?.items.find((domain) => domain?.nativeId === Number(teamId))
    ?.metadata?.name;

const getAmountText = async (
  amount: number | undefined,
  tokenId: string | undefined,
  client: ApolloClient<object>,
): Promise<React.ReactNode> => {
  try {
    if (!amount || !tokenId) {
      return 'funds';
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
          <Numeral value={amount} /> tokens
        </>
      );
    }

    return (
      <>
        <Numeral value={amount} /> {tokenSymbol}
      </>
    );
  } catch {
    return 'funds';
  }
};

const getFromToText = (
  from: string | undefined,
  to: string | undefined,
  colony: ColonyFragment | undefined,
): string => {
  const fromTeamName = getTeamName(from, colony);
  const toTeamName = getTeamName(to, colony);

  if (!fromTeamName || !toTeamName) {
    return 'between teams';
  }

  return `from ${fromTeamName} to ${toTeamName}`;
};

export const trasferFundsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<TransferFundsFormValues>
> = async ({ amount, from, to }, { currentUser, client, colony }) => {
  return (
    <>
      Transfer{' '}
      {await getAmountText(amount?.amount, amount?.tokenAddress, client)}{' '}
      {getFromToText(from, to, colony)}
      {currentUser?.profile?.displayName && (
        <>
          by{' '}
          <UserPopover
            userName={currentUser?.profile?.displayName}
            walletAddress={currentUser.walletAddress}
            aboutDescription={currentUser.profile?.bio || ''}
            user={currentUser}
          >
            <span className="text-blue-400">
              {currentUser.profile.displayName}
            </span>
          </UserPopover>
        </>
      )}
    </>
  );
};
