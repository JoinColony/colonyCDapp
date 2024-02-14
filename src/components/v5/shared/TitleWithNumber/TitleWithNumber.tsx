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
      <span className="flex items-center justify-center text-blue-400 text-[0.375rem] font-bold bg-blue-100 rounded-sm ml-1 min-w-[0.75rem] h-3 pointer-events-none">
        {number}
      </span>
    )}
  </div>
);

TitleWithNumber.displayName = displayName;

export default TitleWithNumber;
