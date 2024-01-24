import { useMemo } from 'react';

/* Used in cases where we need to memoize the transformed output of any data.
 * Transform function has to be pure, obviously
 */
const useTransformer = <
  T extends (...args: any[]) => any,
  A extends Parameters<T>,
>(
  transform: T,
  args: A = [] as unknown as A,
): ReturnType<T> =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo<ReturnType<T>>(
    () => transform(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transform, ...args],
  );

export default useTransformer;
