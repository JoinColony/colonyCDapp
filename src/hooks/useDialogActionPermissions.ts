import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { getUserRolesForDomain } from '~redux/transformers';
import { Colony } from '~types';
import { userHasRole } from '~utils/checks';

import useColonyHasReputation from './useColonyHasReputation';

const useDialogActionPermissions = (
  colony: Colony,
  isVotingExtensionEnabled: boolean,
  requiredRoles: ColonyRole[],
  requiredRolesDomains: number[],
  requiredRepDomain?: number,
) => {
  const { wallet } = useAppContext();
  const { watch } = useFormContext();
  const forceAction = watch('forceAction');

  const hasRoles = requiredRolesDomains.every((domainId) => {
    const userDomainRoles = getUserRolesForDomain(
      colony,
      wallet?.address,
      domainId,
    );

    return requiredRoles.every((role) => userHasRole(userDomainRoles, role));
  });

  const hasReputation = useColonyHasReputation(
    colony.colonyAddress,
    requiredRepDomain,
  );

  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  const userHasPermission =
    hasRoles || (isVotingExtensionEnabled && hasReputation);

  return [userHasPermission, onlyForceAction];
};

export default useDialogActionPermissions;
