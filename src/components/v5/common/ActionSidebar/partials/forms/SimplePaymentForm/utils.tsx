import { OneTxPaymentPayload } from '~redux/types/actions/colonyActions';
import { Colony } from '~types/graphql';
import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { SimplePaymentFormValues } from './hooks';

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
