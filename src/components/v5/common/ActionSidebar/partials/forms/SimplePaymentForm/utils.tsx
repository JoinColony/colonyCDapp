import { ApolloClient } from '@apollo/client';
import { DeepPartial } from 'utility-types';
import moveDecimal from 'move-decimal-point';

import {
  ColonyActionType,
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { Address, Colony, User } from '~types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { formatText } from '~utils/intl';
import { OneTxPaymentPayload } from '~redux/types/actions/colonyActions';

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

    return data?.getUserByAddress?.items?.[0] ?? null;
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
        decisionMethod === DecisionMethod.Permissions
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

type PaymentPayload = OneTxPaymentPayload['payments'][number];

interface GetPaymentPayloadParams {
  colony: Colony;
  recipientAddress: string;
  amount: string;
  tokenAddress: string;
  networkInverseFee?: string;
}

const getPaymentPayload = ({
  colony,
  recipientAddress,
  amount,
  tokenAddress,
  networkInverseFee,
}: GetPaymentPayloadParams): PaymentPayload => {
  const selectedToken = getSelectedToken(colony, tokenAddress);
  const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);

  const amountWithFees = networkInverseFee
    ? calculateFee(amount, networkInverseFee, decimals).totalToPay
    : amount;

  return {
    recipient: recipientAddress,
    tokenAddress,
    amount: amountWithFees, // @NOTE: Only the contract sees this amount
    decimals,
  };
};

export const getSimplePaymentPayload = (
  colony: Colony,
  values: SimplePaymentFormValues,
  networkInverseFee: string | undefined,
) => {
  const {
    from,
    description,
    createdIn,
    title,
    amount,
    recipient: recipientAddress,
    payments,
  } = values;
  const fromDomainId = Number(from);
  const createdInDomainId = Number(createdIn);

  const transformedPayload: OneTxPaymentPayload = {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    domainId: fromDomainId,
    payments: [
      getPaymentPayload({
        colony,
        recipientAddress,
        amount: amount.amount.toString(),
        tokenAddress: amount.tokenAddress,
        networkInverseFee,
      }),
      ...payments.map(({ recipient, amount: paymentAmount }) =>
        getPaymentPayload({
          colony,
          recipientAddress: recipient,
          amount: paymentAmount.amount.toString(),
          tokenAddress: amount.tokenAddress,
          networkInverseFee,
        }),
      ),
    ],
    annotationMessage: description,
    motionDomainId: createdInDomainId,
    customActionTitle: title,
  };

  return transformedPayload;
};
