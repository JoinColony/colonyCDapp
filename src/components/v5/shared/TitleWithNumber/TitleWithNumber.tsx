import React, { FC } from 'react';

import { TitleWithNumberProps } from './types';

const displayName = 'v5.TitleWithNumber';

const TitleWithNumber: FC<TitleWithNumberProps> = ({
  className,
  title,
  number,
}) => (
  <div className="flex items-center gap-1 text-2">
    {title && <h3 className={className}>{title}</h3>}
    {!!number && (
      <span className="p-1 bg-blue-100 text-blue-400 font-bold text-[0.5rem]">
        {number}
      </span>
    )}
  </div>
);

TitleWithNumber.displayName = displayName;

export default TitleWithNumber;
