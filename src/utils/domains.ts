import { Colony, Domain } from '~types/graphql';

import { notNull } from './arrays';
import { sortBy } from './lodash';

export const findDomainByNativeId = (
  domainNativeId: number | null | undefined,
  colony: Colony,
) => {
  const domains = colony.domains?.items;
  if (!domains) {
    return undefined;
  }
  return domains
    .filter(notNull)
    .find(({ nativeId }) => nativeId === domainNativeId);
};

export const getDomainOptions = (colonyDomains: Domain[]) =>
  sortBy(
    colonyDomains.map((domain) => ({
      value: domain?.nativeId || '',
      label: domain?.metadata?.name || `Domain #${domain?.nativeId}`,
    })) || [],
    ['value'],
  );
