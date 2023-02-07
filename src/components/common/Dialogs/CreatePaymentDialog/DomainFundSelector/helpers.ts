import { Domain } from '~types';
import { sortBy } from '~utils/lodash';

export const getDomainOptions = (colonyDomains: Domain[]) =>
  sortBy(
    colonyDomains.map((domain) => ({
      value: `${domain?.nativeId}`,
      label: domain?.name || `Domain #${domain?.nativeId}`,
    })) || [],
    ['value'],
  );
