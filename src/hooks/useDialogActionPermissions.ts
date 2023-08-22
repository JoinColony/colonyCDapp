import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { getUserRolesForDomain } from '~transformers';
import { Colony } from '~types';
import { userHasRole } from '~utils/checks';

const useDialogActionPermissions = (
  colony: Colony,
  isVotingExtensionEnabled: boolean,
  requiredRoles: ColonyRole[],
  requiredRolesDomains: number[],
  hasReputation: boolean,
): [boolean, boolean] => {
  const { wallet } = useAppContext();
  const method = useFormContext();
  const forceAction = method?.watch('forceAction');

  const hasRoles = requiredRolesDomains.every((domainId) => {
    const userDomainRoles = getUserRolesForDomain(
      colony,
      wallet?.address || '',
      domainId,
    );

    return requiredRoles.every((role) => userHasRole(userDomainRoles, role));
  });

  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  return [hasRoles, onlyForceAction];
};

export default useDialogActionPermissions;
