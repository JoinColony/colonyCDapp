import { Id, type ColonyRole } from '@colony/colony-js';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type ColonyContributor } from '~types/graphql.ts';

interface UseEligibleSigneesParams {
  domainId: number;
  requiredRoles?: ColonyRole[][];
}

export const useEligibleSignees = ({
  domainId,
  requiredRoles,
}: UseEligibleSigneesParams) => {
  const { totalMembers } = useMemberContext();

  if (Number.isNaN(domainId)) {
    throw new Error('domainId must be a number');
  }

  const domainIds =
    domainId === Id.RootDomain ? [Id.RootDomain] : [Id.RootDomain, domainId];

  const getEligibleSignees = (members: ColonyContributor[]) => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return {
        eligibleSignees: {},
        uniqueEligibleSignees: [],
      };
    }

    const matches: {
      [role: number]: { [userAddress: string]: ColonyContributor['user'] };
    } = {};

    const uniqueEligibleSignees = new Set<ColonyContributor['user']>();

    members.forEach((member) => {
      if (!member.roles) {
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

        // Check if assignedRoles includes all roles in any requiredRoles array
        if (
          requiredRoles.some((roles) =>
            roles.every((role) => assignedRoles.includes(role)),
          )
        ) {
          if (member.user) {
            const key = member.user.walletAddress;
            uniqueEligibleSignees.add(member.user);

            requiredRoles.forEach((roles) => {
              roles.forEach((role) => {
                if (assignedRoles.includes(role)) {
                  if (!matches[role]) {
                    matches[role] = {};
                  }
                  matches[role][key] = member.user;
                }
              });
            });
          }
        }
      });
    });

    return {
      eligibleSignees: matches,
      uniqueEligibleSignees: [...uniqueEligibleSignees],
    };
  };

  const { eligibleSignees, uniqueEligibleSignees } =
    getEligibleSignees(totalMembers);

  const countPerRole: { [role: number]: number } = {};
  Object.keys(eligibleSignees).forEach((role) => {
    const numberOfUsers = Object.keys(eligibleSignees[role]).length;
    countPerRole[role] = numberOfUsers;
  });

  return {
    eligibleSignees,
    uniqueEligibleSignees,
    countPerRole,
  };
};
