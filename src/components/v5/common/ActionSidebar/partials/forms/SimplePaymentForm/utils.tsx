import { type OneTxPaymentPayload } from '~redux/types/actions/colonyActions.ts';
import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { type SimplePaymentFormValues } from './hooks.ts';

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
    recipientAddress,
    tokenAddress,
    amount: amountWithFees, // @NOTE: Only the contract sees this amount
  };
};

export const getSimplePaymentPayload = (
  colony: Colony,
  values: SimplePaymentFormValues,
  networkInverseFee: string | undefined,
) => {
  const {
    from,
    description: annotationMessage,
    createdIn,
    title,
    amount,
    tokenAddress,
    recipientAddress,
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
        amount: amount.toString(),
        tokenAddress,
        networkInverseFee,
      }),
      ...payments.map(
        ({
          recipientAddress: paymentRecipientAddress,
          amount: paymentAmount,
        }) =>
          getPaymentPayload({
            colony,
            recipientAddress: paymentRecipientAddress,
            amount: paymentAmount.toString(),
            tokenAddress,
            networkInverseFee,
          }),
      ),
    ],
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    motionDomainId: createdInDomainId,
    customActionTitle: title,
  };

  return transformedPayload;
};
