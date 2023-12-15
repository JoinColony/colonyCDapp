import { DeepPartial } from 'utility-types';

import { objectKeys } from '~utils/object';
import { cloneDeepWith, isEqual } from '~utils/lodash';

import { FiltersValue } from './types';

export const pickOneOfFilters = <T extends DeepPartial<FiltersValue>>(
  filters: T,
  prevFilters: T,
): T => {
  if (isEqual(filters, prevFilters)) {
    return filters;
  }

  const newSelectedKey = objectKeys(filters).find((key) => {
    const filter = filters[key];
    const prevFilter = prevFilters[key];

    return filter === true && prevFilter !== true;
  });

  if (!newSelectedKey) {
    return {} as T;
  }

  return {
    [newSelectedKey]: true,
  } as T;
};

export const countCheckedFilters = <T extends DeepPartial<FiltersValue>>(
  filters: T | undefined | boolean,
): number => {
  if (typeof filters === 'boolean') {
    return 1;
  }

  let count = 0;

  cloneDeepWith(filters || {}, (value) => {
    if (value === true) {
      count += 1;
    }
  });

  return count;
};

export const isAnyFilterChecked = <T extends DeepPartial<FiltersValue>>(
  filters: T | undefined | boolean,
): boolean => countCheckedFilters(filters) > 0;
