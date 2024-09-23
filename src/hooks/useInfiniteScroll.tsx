import { Smiley } from '@phosphor-icons/react';
import { useInView } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';

interface Params {
  canFetchMore: boolean;
  isSinglePage: boolean;
  fetchMore: () => Promise<void>;
}

const useInfiniteScroll = ({
  canFetchMore,
  isSinglePage,
  fetchMore,
}: Params) => {
  const containerNode = useRef(null);
  const endNode = useRef<HTMLDivElement>(null);

  const isInView = useInView(endNode, { root: containerNode });
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isInView && !isFetching && canFetchMore) {
      setIsFetching(true);
      fetchMore().then(
        () => setIsFetching(false),
        () => setIsFetching(false),
      );
    }
    // We are not including fetchMore here as we really only want to react to changes of isInView
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetchMore, isInView]);

  const InfiniteScrollTrigger = useMemo(
    () => (
      <div
        ref={endNode}
        className="flex items-center justify-center px-6 pb-4 pt-2 text-sm"
      >
        {canFetchMore ? (
          <>
            <SpinnerLoader />
            <span className="mx-2">
              {formatText({ id: 'status.loading' }, { optionalText: ' more' })}
            </span>
          </>
        ) : (
          !isSinglePage && (
            <div className="text-gray-400">
              <Smiley className="mr-1 inline-block" />
              <span className="text-xs">
                {formatText({ id: 'loader.noMoreResults' })}
              </span>
            </div>
          )
        )}
      </div>
    ),
    [canFetchMore, isSinglePage],
  );

  return {
    containerNode,
    InfiniteScrollTrigger,
  };
};

export default useInfiniteScroll;
