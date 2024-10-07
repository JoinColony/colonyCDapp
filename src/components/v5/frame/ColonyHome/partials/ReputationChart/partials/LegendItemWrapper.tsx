import React, { type PropsWithChildren, type FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const displayName =
  'v5.frame.ColonyHome.ReputationChart.partials.LegendItemWrapper';

const LegendItemWrapper: FC<
  PropsWithChildren<{ id?: string; searchParam?: string }>
> = ({ children, id, searchParam }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClick = useCallback(() => {
    if (id && searchParam) {
      searchParams.set(searchParam, id);
      setSearchParams(searchParams);
    }
  }, [id, searchParam, searchParams, setSearchParams]);
  if (searchParam) {
    return (
      <button
        type="button"
        className="flex flex-row items-center gap-1"
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }
  return <div className="flex flex-row items-center gap-1">{children}</div>;
};

LegendItemWrapper.displayName = displayName;

export default LegendItemWrapper;
