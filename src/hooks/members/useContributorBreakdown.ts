import {
  type ColonyContributor,
  type ContributorReputation,
  type ContributorRoles,
} from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';

import {
  type AvailablePermission,
  type DomainWithPermissionsAndReputation,
} from './types.ts';

const mergeDomains = (
  reputation: ContributorReputation[],
  permissions: ContributorRoles[],
) => {
  const domains: Record<string, DomainWithPermissionsAndReputation> = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const { __typename, ...repInfo } of reputation) {
    domains[repInfo.domainId] = {
      ...repInfo,
      nativeId: repInfo.domain.nativeId,
      permissions: [],
      multiSigPermissions: [],
      domainColor: repInfo.domain.metadata?.color,
      domainName:
        repInfo.domain.metadata?.name ?? `Domain ${repInfo.domain.nativeId}`,
    };
  }

  for (const permDomain of permissions) {
    const { roles, multiSigRoles } = Object.keys(permDomain).reduce(
      (acc, key) => {
        if (!key.startsWith('role_') || !permDomain[key]) {
          return acc;
        }

        const role = Number(key.split('_')[1]) as AvailablePermission;

        if (permDomain[key]) {
          if (permDomain.isMultiSig) {
            acc.multiSigRoles.push(role);
          } else {
            acc.roles.push(role);
          }
        }

        return acc;
      },
      {
        roles: [] as AvailablePermission[],
        multiSigRoles: [] as AvailablePermission[],
      },
    );

    const { domainId } = permDomain;
    const domain = domains[domainId];

    if (domain) {
      if (roles.length > 0) {
        domain.permissions = roles;
      }
      if (multiSigRoles.length > 0) {
        domain.multiSigPermissions = multiSigRoles;
      }
    } else {
      domains[domainId] = {
        nativeId: permDomain.domain.nativeId,
        domainId: permDomain.domainId,
        domainColor: permDomain.domain?.metadata?.color,
        domainName:
          permDomain.domain?.metadata?.name ??
          `Domain ${permDomain.domain.nativeId}`,
        permissions: roles,
        multiSigPermissions: multiSigRoles,
        reputationRaw: '0',
        reputationPercentage: 0,
      };
    }
  }

  return Object.values(domains).sort((a, b) => a.nativeId - b.nativeId);
};

export const getContributorBreakdown = (
  contributor?: ColonyContributor | null,
) => {
  if (!contributor) {
    return [];
  }
  const rep = contributor.reputation?.items.filter(notNull) ?? [];
  const roles = contributor.roles?.items.filter(notNull) ?? [];

  return mergeDomains(rep, roles);
};

const useContributorBreakdown = (contributor?: ColonyContributor | null) => {
  return getContributorBreakdown(contributor);
};

export default useContributorBreakdown;
