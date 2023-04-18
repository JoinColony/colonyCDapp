import React from 'react';

import { TwoColumnsProps } from './types';

const TwoColumns: React.FC<TwoColumnsProps> = ({ aside, mainColumn }) => (
  <div className="grid grid-cols-1 md:grid-cols-[8.9375rem_1fr] md:gap-12 lg:gap-[6.25rem]">
    <aside className="hidden md:block">{aside}</aside>
    <div>{mainColumn}</div>
  </div>
);

export default TwoColumns;
