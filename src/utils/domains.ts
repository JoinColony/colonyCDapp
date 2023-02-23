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
