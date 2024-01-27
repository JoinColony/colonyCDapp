import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext.tsx';
import { Colony } from '~types/graphql.ts';
import { addressHasRoles } from '~utils/checks/index.ts';

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
