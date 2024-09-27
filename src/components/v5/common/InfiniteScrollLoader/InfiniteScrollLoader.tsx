import { Smiley } from '@phosphor-icons/react';
import React, {
  type RefObject,
  type FC,
  useRef,
  useState,
  useCallback,
} from 'react';

import useOnScrolledIntoView from '~hooks/useOnScrollIedntoView.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';

interface Props {
  canFetchMore: boolean;
  containerRef: RefObject<Element>;
  fetchMore: () => Promise<void>;
}

const displayName = 'v5.common.InfiniteScrollLoader';

const InfiniteScrollTrigger: FC<Props> = ({
  canFetchMore,
  containerRef,
  fetchMore,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isFetching, setIsFetching] = useState(false);

  const onScrolledIntoView = useCallback(() => {
    if (!isFetching && canFetchMore) {
      setIsFetching(true);
      fetchMore().then(
        () => setIsFetching(false),
        () => setIsFetching(false),
      );
    }
  }, [canFetchMore, fetchMore, isFetching]);

  useOnScrolledIntoView({
    containerRef,
    ref,
    onScrolledIntoView,
  });

  return (
    <div
      ref={ref}
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
        <div className="text-gray-400">
          <Smiley className="mr-1 inline-block" />
          <span className="text-xs">
            {formatText({ id: 'loader.noMoreResults' })}
          </span>
        </div>
      )}
    </div>
  );
};

InfiniteScrollTrigger.displayName = displayName;

export default InfiniteScrollTrigger;
