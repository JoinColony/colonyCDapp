import React, { type FC, type PropsWithChildren } from 'react';

import { type TwoColumnsProps } from './types.ts';

const displayName = 'v5.frame.TwoColumns';

const TwoColumns: FC<PropsWithChildren<TwoColumnsProps>> = ({
  aside,
  children,
}) => (
  <div className="grid w-full grid-cols-1 sm:grid-cols-[8.9375rem_1fr] sm:gap-12 lg:gap-[6.25rem]">
    <aside className="hidden sm:block">{aside}</aside>
    <div>{children}</div>
  </div>
);

TwoColumns.displayName = displayName;

export default TwoColumns;
