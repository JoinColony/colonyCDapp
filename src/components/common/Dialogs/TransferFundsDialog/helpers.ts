import { ColonyRole } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useFormContext } from 'react-hook-form';

import { useActionDialogStatus, useAppContext, useTransformer, EnabledExtensionData } from '~hooks';
import { getUserRolesForDomain } from '~redux/transformers';
import { Colony } from '~types';
import { userHasRole } from '~utils/checks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

export const getTransferFundsDialogPayload = (
  colony: Colony,
  { tokenAddress, amount: transferAmount, fromDomain: sourceDomain, toDomain, annotation: annotationMessage },
) => {
  const colonyTokens = colony?.tokens?.items || [];
  const selectedToken = colonyTokens.find((token) => token?.token.tokenAddress === tokenAddress);
  const decimals = getTokenDecimalsWithFallback(selectedToken?.token.decimals);

  // Convert amount string with decimals to BigInt (eth to wei)
  const amount = BigNumber.from(moveDecimal(transferAmount, decimals));

  return {
    colonyAddress: colony?.colonyAddress,
    colonyName: colony?.name,
    // version,
    fromDomainId: parseInt(sourceDomain, 10),
    toDomainId: parseInt(toDomain, 10),
    amount,
    tokenAddress,
    annotationMessage,
  };
};

export const useTransferFundsDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const { wallet } = useAppContext();
  const { watch } = useFormContext();
  const { fromDomain: fromDomainId, toDomain: toDomainId } = watch();
  const fromDomainRoles = useTransformer(getUserRolesForDomain, [colony, wallet?.address, fromDomainId]);
  const { userHasPermission, disabledSubmit, disabledInput, canCreateMotion, canOnlyForceAction } =
    useActionDialogStatus(colony, requiredRoles, [fromDomainId, toDomainId], enabledExtensionData);

  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
    hasRoleInFromDomain,
  };
};
