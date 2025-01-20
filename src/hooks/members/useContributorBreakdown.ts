import { Id } from '@colony/colony-js';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type DomainFragment } from '~gql';
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
  colonyDomains: DomainFragment[],
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

  const hasPermissionsInRoot = Object.values(domains).some(
    (domain) =>
      domain.nativeId === Id.RootDomain &&
      (domain.permissions.length > 0 || domain.multiSigPermissions.length > 0),
  );

  // Ensure all domains are included if there are permissions in the root domain
  if (hasPermissionsInRoot) {
    for (const colonyDomain of colonyDomains) {
      // Skip domains that are already included
      if (
        !Object.values(domains).some(
          (domain) => domain.nativeId === colonyDomain.nativeId,
        )
      ) {
        domains[colonyDomain.id] = {
          nativeId: colonyDomain.nativeId,
          domainId: colonyDomain.id,
          domainColor: colonyDomain?.metadata?.color,
          domainName:
            colonyDomain?.metadata?.name ?? `Domain ${colonyDomain.nativeId}`,
          permissions: [],
          multiSigPermissions: [],
          reputationRaw: '0',
          reputationPercentage: 0,
        };
      }
    }
  }

  return Object.values(domains).sort((a, b) => a.nativeId - b.nativeId);
};

export const getContributorBreakdown = (
  domains: DomainFragment[],
  contributor?: ColonyContributor | null,
) => {
  if (!contributor) {
    return [];
  }
  const rep = contributor.reputation?.items.filter(notNull) ?? [];
  const roles = contributor.roles?.items.filter(notNull) ?? [];

  return mergeDomains(rep, roles, domains);
};

const useContributorBreakdown = (contributor?: ColonyContributor | null) => {
  const {
    colony: { domains },
  } = useColonyContext();

  const contributorBreakdown = getContributorBreakdown(
    domains?.items.filter(notNull) || [],
    contributor,
  );

  return contributorBreakdown;
};

export default useContributorBreakdown;
