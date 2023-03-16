import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { Colony } from '~types';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const getCreatePaymentDialogPayload = (colony: Colony, payload: any) => {
  const {
    amount,
    tokenAddress,
    fromDomain,
    recipient: { walletAddress },
    annotation: annotationMessage,
    motionDomainId,
  } = payload;
  const selectedToken = getSelectedToken(colony, tokenAddress);

  const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);

  // const amountWithFees = networkFeeInverse
  //   ? calculateFee(amount, networkFeeInverse, decimals).totalToPay
  //   : amount;

  return {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    recipientAddress: walletAddress,
    domainId: fromDomain,
    singlePayment: {
      tokenAddress,
      amount, // amountWithFees - @NOTE: The contract only sees this amount
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
  const fromDomain = watch('fromDomain');
  const { isOneTxPaymentEnabled } = enabledExtensionData;
  const {
    userHasPermission,
    disabledSubmit,
    disabledInput: defaultDisabledInput,
    canCreateMotion,
  } = useActionDialogStatus(colony, requiredRoles, [fromDomain], enabledExtensionData);
  const disabledInput = defaultDisabledInput || !isOneTxPaymentEnabled;

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canCreatePayment: isOneTxPaymentEnabled,
  };
};
