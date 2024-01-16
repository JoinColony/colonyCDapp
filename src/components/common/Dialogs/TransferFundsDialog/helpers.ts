import { ColonyRole } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useFormContext } from 'react-hook-form';

import {
  useActionDialogStatus,
  useAppContext,
  useTransformer,
  EnabledExtensionData,
} from '~hooks';
import { getUserRolesForDomain } from '~transformers';
import { Colony } from '~types';
import { userHasRole } from '~utils/checks';
import { findDomainByNativeId } from '~utils/domains';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { TransferFundsFormValues } from '~v5/common/ActionSidebar/partials/forms/TransferFundsForm/hooks';

export const getTransferFundsDialogPayload = (
  colony: Colony,
  {
    amount: { amount: transferAmount, tokenAddress },
    from: fromDomainId,
    to: toDomainId,
    description: annotationMessage,
  }: TransferFundsFormValues,
) => {
  const colonyTokens = colony?.tokens?.items || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.token.tokenAddress === tokenAddress,
  );
  const decimals = getTokenDecimalsWithFallback(selectedToken?.token.decimals);

  // Convert amount string with decimals to BigInt (eth to wei)
  const amount = BigNumber.from(moveDecimal(transferAmount, decimals));

  const fromDomain = findDomainByNativeId(fromDomainId, colony);
  const toDomain = findDomainByNativeId(toDomainId, colony);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    colonyVersion: colony.version,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    annotationMessage,
    customActionTitle: '',
  };
};

export const useTransferFundsDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const { wallet } = useAppContext();
  const { watch } = useFormContext();
  const { fromDomainId, toDomainId } = watch();
  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address ?? '',
    fromDomainId,
  ]);
  const actionDialogStatus = useActionDialogStatus(
    colony,
    requiredRoles,
    [fromDomainId, toDomainId],
    enabledExtensionData,
  );

  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);

  return {
    ...actionDialogStatus,
    hasRoleInFromDomain,
  };
};
