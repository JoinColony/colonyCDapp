import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { Colony } from '~types';
import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

export const getCreatePaymentDialogPayload = (
  colony: Colony,
  payload: any,
  networkInverseFee: string | undefined,
) => {
  const {
    amount,
    tokenAddress,
    fromDomainId,
    recipient: { walletAddress },
    annotation: annotationMessage,
    motionDomainId,
  } = payload;
  const selectedToken = getSelectedToken(colony, tokenAddress);

  const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);

  const amountWithFees = networkInverseFee
    ? calculateFee(amount, networkInverseFee, decimals).totalToPay
    : amount;

  return {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    recipientAddress: walletAddress,
    domainId: fromDomainId,
    singlePayment: {
      tokenAddress,
      amount: amountWithFees, // @NOTE: Only the contract sees this amount
      decimals,
    },
    annotationMessage,
    motionDomainId,
  };
};

export const useCreatePaymentDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const { watch } = useFormContext();
  const { fromDomainId, motionDomainId } = watch();
  const { isOneTxPaymentEnabled } = enabledExtensionData;
  const { disabledInput: defaultDisabledInput, ...rest } =
    useActionDialogStatus(
      colony,
      requiredRoles,
      [fromDomainId],
      enabledExtensionData,
      motionDomainId,
    );
  const disabledInput = defaultDisabledInput || !isOneTxPaymentEnabled;

  return {
    ...rest,
    disabledInput,
    canCreatePayment: isOneTxPaymentEnabled,
  };
};
