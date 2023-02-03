import { Colony } from '~types';
import { notNull } from './arrays';

export const findDomain = (domainId?: string | null, colony?: Colony) => {
  const domains = colony?.domains?.items;
  if (!domains || !domainId) {
    return undefined;
  }
  return domains.filter(notNull).find(({ id }) => id === domainId);
};
