import { useEffect, useRef } from 'react';

const usePrevious = <T>(value: T): T | void => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
