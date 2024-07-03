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

  const getEligibleSignees = (members: ColonyContributor[]) => {
    if (!requiredRoles) {
      return {
        eligibleSignees: {},
        uniqueEligibleSignees: [],
      };
    }

    const matches = requiredRoles.reduce((acc, role) => {
      acc[role] = {};
      return acc;
    }, {}) as {
      [role: number]: { [userAddress: string]: ColonyContributor['user'] };
    };

    const uniqueEligibleSignees = new Set();

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

        requiredRoles.forEach((role) => {
          if (!member.user) {
            return;
          }

          if (assignedRoles.includes(role)) {
            const key = member.user.walletAddress;
            matches[role][key] = member.user;

            uniqueEligibleSignees.add(member.user);
          }
        });
      });
    });

    return {
      eligibleSignees: matches,
      uniqueEligibleSignees: [
        ...uniqueEligibleSignees,
      ] as ColonyContributor['user'][],
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
