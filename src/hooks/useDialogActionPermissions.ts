import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext, useTransformer } from '~hooks';
import { getUserRolesForDomain } from '~redux/transformers';
import { Colony } from '~types';
import { userHasRole } from '~utils/checks';

import useColonyReputation from './useColonyReputation';

const useDialogActionPermissions = (
  colony: Colony,
  isVotingExtensionEnabled: boolean,
  requiredRoles: ColonyRole[],
  domainId: number,
) => {
  const { wallet } = useAppContext();
  const { getValues } = useFormContext();
  const { forceAction } = getValues();
  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    domainId,
  ]);

  const hasRoles = requiredRoles.every((role) =>
    userHasRole(fromDomainRoles, role),
  );

  const hasReputation = useColonyReputation(colony.colonyAddress, domainId);

  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  const userHasPermission =
    hasRoles || (isVotingExtensionEnabled && hasReputation);

  return [userHasPermission, onlyForceAction];
};

export default useDialogActionPermissions;
