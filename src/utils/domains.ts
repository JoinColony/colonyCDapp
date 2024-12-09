import { type Colony, type Domain } from '~types/graphql.ts';

import { notMaybe, notNull } from './arrays/index.ts';
import { sortBy } from './lodash.ts';

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

export const extractColonyDomains = (
  colonyDomains: Colony['domains'],
): Domain[] => {
  return colonyDomains?.items.filter(notMaybe) ?? [];
};

export const getDomainNameFallback = ({
  domainName,
  nativeId,
}: {
  domainName?: string;
  nativeId: number;
}) => {
  return domainName || `Team #${nativeId}`;
};
