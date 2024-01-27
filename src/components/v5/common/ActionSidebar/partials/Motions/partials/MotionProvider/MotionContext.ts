import { createContext } from 'react';

import { MotionContextValues } from './types.ts';

export const MotionContext = createContext<MotionContextValues | undefined>(
  undefined,
);
