import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { Colony, Member } from '~types';
import { notNull, notUndefined } from '~utils/arrays';
import { calculateFee, getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const extractUsersFromColonyMemberData = (members: Member[] | null | undefined) =>
  members
    ?.map((member) => member.user)
    .filter(notNull)
    .filter(notUndefined) || [];

export const getCreatePaymentDialogPayload = (colony: Colony, payload: any, networkInverseFee: string | undefined) => {
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

  const amountWithFees = networkInverseFee ? calculateFee(amount, networkInverseFee, decimals).totalToPay : amount;

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
  const fromDomain = watch('fromDomainId');
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
