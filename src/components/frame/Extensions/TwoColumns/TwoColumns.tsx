import React, { FC, PropsWithChildren } from 'react';

import { TwoColumnsProps } from './types';

const displayName = 'frame.Extensions.TwoColumns';

const TwoColumns: FC<PropsWithChildren<TwoColumnsProps>> = ({ aside, children }) => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-[8.9375rem_1fr] sm:gap-12 lg:gap-[6.25rem]">
    <aside className="hidden sm:block">{aside}</aside>
    <div>{children}</div>
  </div>
);

TwoColumns.displayName = displayName;

export default TwoColumns;
