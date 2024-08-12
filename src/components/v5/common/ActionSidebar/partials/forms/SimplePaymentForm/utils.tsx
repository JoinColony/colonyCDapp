import { type OneTxPaymentPayload } from '~redux/types/actions/colonyActions.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
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
    recipient,
    payments,
    decisionMethod,
  } = values;
  const fromDomainId = Number(from);
  const createdInDomainId = Number(createdIn);

  const basePayload = {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    domainId: fromDomainId,
    payments: [
      getPaymentPayload({
        colony,
        recipientAddress: recipient,
        amount: amount.toString(),
        tokenAddress,
        networkInverseFee,
      }),
      ...payments.map(
        ({ recipient: paymentRecipientAddress, amount: paymentAmount }) =>
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
    customActionTitle: title,
  };

  if (decisionMethod === DecisionMethod.Permissions) {
    return basePayload;
  }

  return {
    ...basePayload,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    motionDomainId: createdInDomainId,
    isMultiSig: decisionMethod === DecisionMethod.MultiSig,
  };
};
