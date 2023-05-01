import { Colony, Domain } from '~types';

import { sortBy } from './lodash';
import { notNull } from './arrays';

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

/**
 * As we have to self-manage the database IDs of the domains, this helper function generates it for us
 */
export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeDomainId: number,
) => {
  return `${colonyAddress}_${nativeDomainId}`;
};

export const getMotionDomainDatabaseId = (
  colonyAddress: string,
  txHash: number,
) => {
  return `${colonyAddress}_motion-${txHash}`;
};

export const getDomainOptions = (colonyDomains: Domain[]) =>
  sortBy(
    colonyDomains.map((domain) => ({
      value: domain?.nativeId || '',
      label: domain?.metadata?.name || `Domain #${domain?.nativeId}`,
    })) || [],
    ['value'],
  );
