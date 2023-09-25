import { useRef } from 'react';

const useWrapWithRef = <T>(value: T): React.MutableRefObject<T> => {
  const ref = useRef<T>(value);

  ref.current = value;

  return ref;
};

export default useWrapWithRef;
