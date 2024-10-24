import { useInView } from 'framer-motion';
import { type RefObject, useEffect } from 'react';

import usePrevious from './usePrevious.ts';

interface Params {
  containerRef: RefObject<Element>;
  ref: RefObject<Element>;
  onScrolledIntoView: () => void;
}

const useOnScrolledIntoView = ({
  containerRef,
  ref,
  onScrolledIntoView,
}: Params) => {
  const isInView = useInView(ref, { root: containerRef });
  const previousIsInView = usePrevious(isInView);

  useEffect(() => {
    if (isInView && !previousIsInView) {
      onScrolledIntoView();
    }
  }, [isInView, onScrolledIntoView, previousIsInView]);
};

export default useOnScrolledIntoView;
