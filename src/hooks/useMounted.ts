import { useEffect, useRef } from 'react';

/*
 * To avoid state updates when this component is unmounted, use a ref
 * that is set to false when cleaning up.
 */
const useMounted = () => {
  const ref = useRef(true);
  useEffect(
    () => () => {
      ref.current = false;
    },
    [],
  );
  return ref;
};

export default useMounted;
