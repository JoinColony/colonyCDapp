/**
 * Sort an array of objects by multiple properties.
 */
type ValidSortByType = boolean | number | string;

interface SortByPropertyConfig {
  // Name is mandatory, otherwise you could just use the array sort function
  name: string;
  compareFn?: (prevVal: any, nextVal: any) => number;
  reverse?: boolean;
}

export const sortObjectsBy = (
  ...sortByPropertyNames: (string | SortByPropertyConfig)[]
): ((prev: object, next: object) => number) => {
  const defaultCompare = (valA: ValidSortByType, valB: ValidSortByType): number => {
    if (!!valA && valB === undefined) {
      return -1;
    }
    if (!!valB && valA === undefined) {
      return 1;
    }

    if (typeof valA !== typeof valB) {
      return 0;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      // eslint-disable-next-line no-param-reassign
      valA = valA.toLowerCase();
      // eslint-disable-next-line no-param-reassign
      valB = valB.toLowerCase();
    }

    if (valA === valB) {
      return 0;
    }

    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      if (valA || valB) {
        return valA ? -1 : 1;
      }
    }

    return valA < valB ? -1 : 1;
  };

  const sortByConfigs = sortByPropertyNames.map((sortKey) =>
    typeof sortKey === 'string' ? { name: sortKey } : sortKey,
  );

  return (prev: object, next: object): number => {
    let result = 0;

    for (let i = 0; i < sortByConfigs.length; i += 1) {
      const { name, compareFn = defaultCompare, reverse = false }: SortByPropertyConfig = sortByConfigs[i];

      const directionMultiplier = reverse ? -1 : 1;
      const prevVal = prev[name];
      const nextVal = next[name];

      result = compareFn(prevVal, nextVal) * directionMultiplier;
      if (result !== 0) {
        break;
      }
    }
    return result;
  };
};

/**
 * Nest a an array of object using ids and they're parents ids
 *
 * @NOTE The parent must be always be declared (have a lower id) than the child
 * While normal logic would imply this, you might run into issues, so take care.
 *
 * As for what this list does, is to take an array of `ConsumableItem` object
 * and create a structure of nested ones.
 *
 * Eg:
 * [
 *   { id: 1 },
 *   { id: 2, parent: 1 },
 *   { id: 3, parent: 2 }
 * ]
 *
 * Is going to be transformed into:
 * [
 *   {
 *     id: 1,
 *     children: [
 *       {
 *         id: 2,
 *         children: [
 *           {
 *             id: 3,
 *           },
 *         ],
 *       },
 *     ],
 *   },
 * ]
 */
interface ConsumableItem {
  id: number;
  name: string;
  parent?: number;
  children?: ConsumableItem[];
}
interface CollapsedItem {
  id: number;
  name: string;
  children?: CollapsedItem[];
}
export const recursiveNestChildren = (items: ConsumableItem[] = [], firstParentLevel = 0) => {
  const collapsedItems: CollapsedItem[] = [];
  items.forEach((item) => {
    if (!item.parent) {
      /*
       * If the current item doesn't have the `parent` prop, we add it with id 0
       */

      /* eslint-disable-next-line no-param-reassign */
      item.parent = 0;
    }
    if (item.parent === firstParentLevel) {
      const children = recursiveNestChildren(items, item.id);

      /*
       * Add the children prop (which was already costructed recursevly)
       */
      if (children.length) {
        /* eslint-disable-next-line no-param-reassign */
        item.children = children;
      }
      collapsedItems.push(item);
    }
  });
  return collapsedItems;
};

export const arrayToObject = (arr: any[]) =>
  arr.reduce((obj, current, idx) => {
    // eslint-disable-next-line no-param-reassign
    obj[idx.toString()] = current;
    return obj;
  }, {});

// To filter arrays
export const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;
export const notNull = <T>(x: T | null): x is T => x !== null;

export const immutableSort = <T>(arr: T[], sortFn?: (a: T, b: T) => number): any[] => [...arr].sort(sortFn);
