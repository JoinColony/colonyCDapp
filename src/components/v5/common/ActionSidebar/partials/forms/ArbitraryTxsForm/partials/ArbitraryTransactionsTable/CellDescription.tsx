import clsx from 'clsx';
import React, { type ReactNode, type FC } from 'react';

import { useTablet } from '~hooks';

export interface CellDescriptionItem {
  name: ReactNode;
  value: ReactNode;
}
interface CellDescriptionProps {
  data: CellDescriptionItem[];
}

const CellDescription: FC<CellDescriptionProps> = ({ data }) => {
  const isTablet = useTablet();
  return (
    <div className="w-full pt-0.5">
      {data.map(({ name, value }) => {
        return (
          <span
            key={`${name}-${value}`}
            className={clsx(
              ' mb-3 flex flex-col text-md [&:last-child]:mb-1.5',
              {
                '!flex-row gap-1': isTablet,
              },
            )}
          >
            <span
              className={clsx(
                'whitespace-nowrap font-medium text-gray-900',
                {},
              )}
            >
              {name}:
            </span>
            <span className="truncate text-gray-600">{value}</span>
          </span>
        );
      })}
    </div>
  );
};
export default CellDescription;
