import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { Colony } from '~types';
import { addressHasRoles } from '~utils/checks';

const useDialogActionPermissions = (
  colony: Colony | undefined,
  isVotingExtensionEnabled: boolean,
  requiredRoles: ColonyRole[],
  requiredRolesDomains: number[],
  hasReputation: boolean,
): [boolean, boolean] => {
  const { wallet } = useAppContext();
  const method = useFormContext();
  const forceAction = method?.watch('forceAction');

  const hasRoles = addressHasRoles({
    colony,
    requiredRoles,
    requiredRolesDomains,
    address: wallet?.address ?? '',
  });
  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  return [hasRoles, onlyForceAction];
};

export default useDialogActionPermissions;
