import { Id } from '@colony/colony-js';

import { Domain } from '~types';
import { sortBy } from '~utils/lodash';

export const getDomainOptions = (
  colonyDomains: Domain[],
  skipRootDomain?: boolean,
) =>
  sortBy(
    colonyDomains.map((domain) => ({
      value: domain?.nativeId || '',
      label: domain?.metadata?.name || `Domain #${domain?.nativeId}`,
    })) || [],
    ['value'],
  );
