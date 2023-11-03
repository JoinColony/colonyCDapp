import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import React from 'react';
import { DeepPartial } from 'utility-types';
import {
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
} from '~gql';
import Numeral from '~shared/Numeral';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { DISTRIBUTION_METHOD } from '../../consts';
import { SplitPaymentFormValues } from './consts';

const getAmountText = async (
  amount: DeepPartial<SplitPaymentFormValues>['amount'],
  client: ApolloClient<object>,
): Promise<React.ReactNode> => {
  if (!amount || !amount.amount) {
    return 'an unspecified amount';
  }

  const { amount: amountValue, tokenAddress } = amount;

  if (!tokenAddress) {
    return <Numeral value={amountValue} />;
  }

  try {
    const { data } = await client.query<
      GetTokenByAddressQuery,
      GetTokenByAddressQueryVariables
    >({
      query: GetTokenByAddressDocument,
      variables: { address: tokenAddress },
    });

    const tokenSymbol = first(data?.getTokenByAddress?.items)?.symbol;

    return (
      <>
        <Numeral value={amountValue} /> {tokenSymbol}
      </>
    );
  } catch {
    return 'an unspecified amount';
  }
};

const getDistributionText = (distribution: string | undefined): string => {
  switch (distribution) {
    case DISTRIBUTION_METHOD.ReputationPercentage: {
      return 'by reputation';
    }
    case DISTRIBUTION_METHOD.Unequal: {
      return 'unequally';
    }
    default: {
      return 'equally';
    }
  }
};

export const splitPaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<SplitPaymentFormValues>
> = async ({ amount, distributionMethod }, { currentUser, client }) => (
  <>
    Split Payment of {await getAmountText(amount, client)}{' '}
    {getDistributionText(distributionMethod)} to multiple recipients
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
