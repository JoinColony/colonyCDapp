import { DeepPartial } from 'utility-types';

import { cloneDeepWith, isEqual } from '~utils/lodash';
import { objectKeys } from '~utils/object';

import { FiltersValue } from './types';

export const countCheckedFilters = <T extends DeepPartial<FiltersValue>>(
  filters: T | undefined | boolean,
): number => {
  if (typeof filters === 'boolean') {
    return filters ? 1 : 0;
  }

  let count = 0;

  cloneDeepWith(filters || {}, (value) => {
    if (
      value === true ||
      (Array.isArray(value) &&
        value.length > 0 &&
        value.filter((v) => v !== undefined && v !== null).length > 0)
    ) {
      count += 1;
    }
  });

  return count;
};

export const isAnyFilterChecked = <T extends DeepPartial<FiltersValue>>(
  filters: T | undefined | boolean,
): boolean => countCheckedFilters(filters) > 0;

export const pickOneOfFilters = <T extends DeepPartial<FiltersValue>>(
  filters: T,
  prevFilters: T,
): T => {
  const pickedKeys = objectKeys(filters).filter((key) => {
    const filter = filters[key];

    return isAnyFilterChecked(filter);
  });
  const prevPickedKeys = objectKeys(prevFilters).filter((key) => {
    const prevFilter = prevFilters[key];

    return isAnyFilterChecked(prevFilter);
  }, []);

  if (isEqual(pickedKeys, prevPickedKeys)) {
    return filters;
  }

  const newSelectedKey = pickedKeys.find(
    (key) => !prevPickedKeys.includes(key),
  );

  if (!newSelectedKey) {
    return {} as T;
  }

  return {
    [newSelectedKey]: filters[newSelectedKey],
  } as T;
};
