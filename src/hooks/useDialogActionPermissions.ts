import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { Colony } from '~types';
import { addressHasRoles } from '~utils/checks';

const useDialogActionPermissions = (
  colony: Colony,
  isVotingExtensionEnabled: boolean,
  requiredRoles: ColonyRole[],
  requiredRolesDomains: number[],
  hasReputation: boolean,
): [boolean, boolean] => {
  const { wallet } = useAppContext();
  const { watch } = useFormContext();
  const forceAction = watch('forceAction');

  const hasRoles = addressHasRoles({
    address: wallet?.address ?? '',
    colony,
    requiredRolesDomains,
    requiredRoles,
  });

  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  return [hasRoles, onlyForceAction];
};

export default useDialogActionPermissions;
