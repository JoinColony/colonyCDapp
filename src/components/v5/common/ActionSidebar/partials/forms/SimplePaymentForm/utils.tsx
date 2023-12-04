import { ApolloClient } from '@apollo/client';
import first from 'lodash/first';
import { DeepPartial } from 'utility-types';
import moveDecimal from 'move-decimal-point';

import {
  ColonyActionType,
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { Address, User } from '~types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { formatText } from '~utils/intl';

import { tryGetToken } from '../utils';
import { SimplePaymentFormValues } from './hooks';

const tryGetRecipient = async (
  recipientAddress: Address,
  client: ApolloClient<object>,
): Promise<User | null> => {
  try {
    const { data } = await client.query<
      GetUserByAddressQuery,
      GetUserByAddressQueryVariables
    >({
      query: GetUserByAddressDocument,
      variables: { address: recipientAddress },
    });

    return first(data?.getUserByAddress?.items) || null;
  } catch {
    return null;
  }
};

export const simplePaymentDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<SimplePaymentFormValues>
> = async (
  { recipient, amount, decisionMethod },
  { client, colony, getActionTitleValues },
) => {
  const recipientUser = recipient
    ? await tryGetRecipient(recipient, client)
    : null;
  const token = await tryGetToken(amount?.tokenAddress, client, colony);

  return getActionTitleValues(
    {
      type:
        decisionMethod === DECISION_METHOD.Permissions
          ? ColonyActionType.Payment
          : ColonyActionType.PaymentMotion,
      recipientUser,
      recipientAddress: recipient,
      amount: amount?.amount
        ? moveDecimal(
            amount.amount.toString(),
            getTokenDecimalsWithFallback(token?.decimals),
          )
        : undefined,
      token,
    },
    {
      [ActionTitleMessageKeys.Amount]: formatText({
        id: 'actionSidebar.metadataDescription.anAmount',
      }),
      [ActionTitleMessageKeys.Recipient]: formatText({
        id: 'actionSidebar.metadataDescription.recipient',
      }),
      [ActionTitleMessageKeys.TokenSymbol]: formatText({
        id: 'actionSidebar.metadataDescription.tokens',
      }),
    },
  );
};
