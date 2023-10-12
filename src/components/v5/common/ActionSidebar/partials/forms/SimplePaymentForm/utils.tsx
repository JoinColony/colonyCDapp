import React from 'react';
import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import { DeepPartial } from 'utility-types';
import {
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { SimplePaymentFormValues } from './consts';
import Numeral from '~shared/Numeral';
import UserPopover from '~v5/shared/UserPopover';

const getRecipientText = async (
  recipients: string[],
  client: ApolloClient<object>,
): Promise<string> => {
  try {
    if (recipients.length > 1) {
      return `${recipients.length} recipients`;
    }

    const [firstRecipient] = recipients;

    if (!firstRecipient) {
      return 'recipient';
    }

    const { data } = await client.query<
      GetUserByAddressQuery,
      GetUserByAddressQueryVariables
    >({
      query: GetUserByAddressDocument,
      variables: { address: firstRecipient || '' },
    });

    return (
      first(data?.getUserByAddress?.items)?.profile?.displayName || 'recipient'
    );
  } catch {
    return 'recipient';
  }
};

const getAmountText = async (
  totalAmount: number,
  tokenId: string | undefined,
  recipientsCount: number,
  client: ApolloClient<object>,
): Promise<React.ReactNode> => {
  try {
    if (totalAmount === 0 || !tokenId) {
      return 'amount of tokens';
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
          {recipientsCount > 1 && 'a total of'}
          <Numeral value={totalAmount} /> tokens
        </>
      );
    }

    return (
      <>
        {recipientsCount > 1 && 'a total of '}
        <Numeral value={totalAmount} /> {tokenSymbol}
      </>
    );
  } catch {
    return 'amount of tokens';
  }
};

export const simplePaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<SimplePaymentFormValues>
> = async ({ payments, recipient, amount }, { client, currentUser }) => {
  const recipients = [
    recipient,
    ...(payments || []).map((payment) => payment.recipient),
  ].filter((recipientItem): recipientItem is string => !!recipientItem);

  const totalAmount = [
    amount?.amount,
    ...(payments || []).map((payment) => payment.amount?.amount),
  ].reduce<number>((result, subAmount) => {
    if (!subAmount) {
      return result;
    }

    return result + Number(subAmount);
  }, 0);

  const [recipientText, amountText] = await Promise.all([
    getRecipientText(recipients, client),
    getAmountText(totalAmount, amount?.tokenAddress, recipients.length, client),
  ]);

  return (
    <>
      Pay {recipientText} {amountText}{' '}
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
