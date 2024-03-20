import React, { type FC } from 'react';

import { type TitleWithNumberProps } from './types.ts';

const displayName = 'v5.TitleWithNumber';

const TitleWithNumber: FC<TitleWithNumberProps> = ({
  className,
  title,
  number,
}) => (
  <div className="flex items-center gap-1 text-2">
    {title && <h3 className={className}>{title}</h3>}
    {!!number && (
      <span className="pointer-events-none ml-1 flex h-3 min-w-[0.75rem] items-center justify-center rounded-sm bg-blue-100 text-[0.375rem] font-bold text-blue-400">
        {number}
      </span>
    )}
  </div>
);

TitleWithNumber.displayName = displayName;

export default TitleWithNumber;
