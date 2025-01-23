import isEqual from 'lodash/isEqual';
import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from 'react';

/**
 * A custom hook that uses lodash's isEqual function to perform a deep comparison check for dependencies
 *
 * This is useful for cases where object dependencies are recreated on every render but contain identical values
 *
 * Note: Be cautious when using this hook, as it does not provide unused dependency warnings like the standard `useEffect` hook
 *
 * @param effect - The effect callback to run.
 * @param dependencies - An array of dependencies to deeply compare.
 */
export function useStableDepsEffect(
  callback: EffectCallback,
  dependencies: DependencyList,
) {
  const dependenciesRef = useRef<DependencyList | undefined>(undefined);

  if (!isEqual(dependenciesRef.current, dependencies)) {
    dependenciesRef.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [dependenciesRef.current]);
}
