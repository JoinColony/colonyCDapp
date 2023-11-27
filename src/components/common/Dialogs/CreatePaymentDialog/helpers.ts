import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, EnabledExtensionData } from '~hooks';
import { OneTxPaymentPayload } from '~redux/types/actions/colonyActions';
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
    fromDomainId,
    payments,
    annotation: annotationMessage,
    motionDomainId,
  } = payload;

  const transformedPayload: OneTxPaymentPayload = {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    domainId: fromDomainId,
    payments: payments.map(({ recipient, amount, tokenAddress }) => {
      const selectedToken = getSelectedToken(colony, tokenAddress);
      const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);

      const amountWithFees = networkInverseFee
        ? calculateFee(amount, networkInverseFee, decimals).totalToPay
        : amount;

      return {
        recipient: recipient.walletAddress,
        tokenAddress,
        amount: amountWithFees, // @NOTE: Only the contract sees this amount
        decimals,
      };
    }),
    annotationMessage,
    motionDomainId,
    customActionTitle: `One tx payment made successfully`, // @NOTE: Adding this here for testing while the UI is not hooked up
  };

  return transformedPayload;
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
