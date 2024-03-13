import React, { type FC } from 'react';

import { type CountBoxProps } from './types.ts';

const CountBox: FC<CountBoxProps> = ({ count }) => (
  <span className="pointer-events-none ml-1.5 flex h-3 min-w-[0.75rem] items-center justify-center rounded-sm bg-blue-100 px-[0.1875rem] text-[0.5rem] font-bold text-blue-400">
    <span>{count}</span>
  </span>
);

export default CountBox;
