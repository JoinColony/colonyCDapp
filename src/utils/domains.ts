import { Colony } from '~types';
import { notNull } from './arrays';

export const findDomainByNativeId = (
  domainNativeId?: number | null,
  colony?: Colony,
) => {
  const domains = colony?.domains?.items;
  if (!domains || !domainNativeId) {
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
