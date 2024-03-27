import { ColonyRole } from '@colony/colony-js';

import { UserRole, getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getAllUserRoles } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

export const useGetReleaseDecisionMethodItems = (): DecisionMethodOption[] => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  if (!user) {
    return [];
  }

  const userPermissions = getAllUserRoles(colony, user.walletAddress);
  const userRole = getRole(userPermissions);

  const isPermissionsEnabled =
    userRole.role === UserRole.Owner ||
    userRole.role === UserRole.Admin ||
    userRole.role === UserRole.Payer ||
    userPermissions.includes(ColonyRole.Arbitration);

  return [
    {
      label: 'Permissions',
      value: DecisionMethod.Permissions,
      isDisabled: !isPermissionsEnabled,
    },
  ];
};

export const releaseDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'releaseModal.permissionsDescription',
  }),
};
