import React, { type FC } from 'react';

import { type CountBoxProps } from './types.ts';

const CountBox: FC<CountBoxProps> = ({ count }) => (
  <span className="flex items-center justify-center text-blue-400 text-[0.5rem] font-bold bg-blue-100 rounded-sm ml-1.5 min-w-[0.75rem] h-3 px-[0.1875rem] pointer-events-none">
    <span>{count}</span>
  </span>
);

export default CountBox;
