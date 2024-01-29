import { createContext } from 'react';

import { type MotionContextValues } from './types.ts';

export const MotionContext = createContext<MotionContextValues | undefined>(
  undefined,
);
