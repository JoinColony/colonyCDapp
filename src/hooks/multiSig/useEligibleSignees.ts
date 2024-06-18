import { Id, type ColonyRole } from '@colony/colony-js';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type ColonyContributor } from '~types/graphql.ts';

interface UseEligibleSigneesParams {
  domainId?: number;
  requiredRoles?: ColonyRole[];
}

export const useEligibleSignees = ({
  domainId,
  requiredRoles,
}: UseEligibleSigneesParams) => {
  const { totalMembers } = useMemberContext();

  const domainIds =
    domainId === Id.RootDomain ? [Id.RootDomain] : [Id.RootDomain, domainId];

  const getMatchingRoles = (members: ColonyContributor[]) => {
    const matches = {};

    members.forEach((member) => {
      if (!member.roles || !requiredRoles) {
        return;
      }

      member.roles.items.forEach((item) => {
        if (!item || !item.isMultiSig) {
          return;
        }

        const [, nativeDomainId] = item.domainId.split('_');
        const hasRoleInDomain = domainIds.includes(Number(nativeDomainId));

        if (!hasRoleInDomain) {
          return;
        }

        const assignedRoles = Object.keys(item)
          .filter((key) => key.startsWith('role_') && item[key] === true)
          .map((key) => Number(key.split('_')[1]));

        requiredRoles.forEach((role) => {
          if (assignedRoles.includes(role)) {
            const key = `${member.user?.walletAddress}_${role}`;
            if (
              !matches[key] ||
              Number(matches[key].domainId) !== Id.RootDomain
            ) {
              matches[key] = member.user;
            }
          }
        });
      });
    });

    return Object.values(matches);
  };

  const matchingRoles = getMatchingRoles(totalMembers);
  const eligibleSigneesCount = matchingRoles.length;
  const eligibleSignees = new Set(matchingRoles);

  return {
    eligibleSignees,
    eligibleSigneesCount,
  };
};
