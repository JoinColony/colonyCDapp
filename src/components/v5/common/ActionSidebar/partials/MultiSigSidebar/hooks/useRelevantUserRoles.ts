import { Id, type ColonyRole } from '@colony/colony-js';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getUserRolesForDomain } from '~transformers';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

interface UseRelevantUserRolesParams {
  requiredRoles: ColonyRole[];
  domainId: number;
}

interface UseRelevantUserRolesResult {
  relevantUserRoles: ColonyRole[];
}

export const useRelevantUserRoles = ({
  requiredRoles,
  domainId,
}: UseRelevantUserRolesParams): UseRelevantUserRolesResult => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  if (!user?.walletAddress) {
    return { relevantUserRoles: [] };
  }

  const colonyRoles = extractColonyRoles(colony.roles);

  const userRolesInDomain = getUserRolesForDomain({
    colonyRoles,
    userAddress: user.walletAddress,
    domainId,
    constraint: 'excludeInheritedRoles',
    isMultiSig: true,
  });
  const userRolesInRoot = getUserRolesForDomain({
    colonyRoles,
    userAddress: user.walletAddress,
    domainId: Id.RootDomain,
    constraint: 'excludeInheritedRoles',
    isMultiSig: true,
  });

  const allUserRoles = Array.from(
    new Set([...userRolesInDomain, ...userRolesInRoot]),
  );

  const relevantUserRoles = allUserRoles.filter((role) =>
    requiredRoles.includes(role),
  );

  return {
    relevantUserRoles,
  };
};
