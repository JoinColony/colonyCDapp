import findLast from 'lodash/findLast';

import { ActionTypeString } from '../../types/actions';

export * from './withFetchableDataMap';
export { default as withFetchableDataMap } from './withFetchableDataMap';
export { default as withFetchableData } from './withFetchableData';

export const reduceToLastState = (events: any[], getKey, getValue) =>
  Array.from(
    events.reduceRight((map, event) => {
      const key = getKey(event);
      if (!map.has(key)) {
        map.set(key, getValue(event));
      }
      return map;
    }, new Map()),
  );

export const getLast = findLast;

export const getActionTypes = (
  actionTypes: ActionTypeString | Set<ActionTypeString>,
) => {
  const fetchTypes =
    typeof actionTypes === 'string' ? new Set<any>([actionTypes]) : actionTypes;
  const successTypes = new Set<any>(
    // @ts-ignore
    [...fetchTypes.values()].map((type) => `${type}_SUCCESS`),
  );
  const errorTypes = new Set<any>(
    // @ts-ignore
    [...fetchTypes.values()].map((type) => `${type}_ERROR`),
  );
  return { fetchTypes, successTypes, errorTypes };
};
