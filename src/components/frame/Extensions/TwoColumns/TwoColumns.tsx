import React, { PropsWithChildren } from 'react';

import { TwoColumnsProps } from './types';

const displayName = 'frame.Extensions.TwoColumns';

const TwoColumns: React.FC<PropsWithChildren<TwoColumnsProps>> = ({ aside, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[8.9375rem_1fr] md:gap-12 lg:gap-[6.25rem]">
    <aside className="hidden md:block">{aside}</aside>
    <div>{children}</div>
  </div>
);

TwoColumns.displayName = displayName;

export default TwoColumns;
