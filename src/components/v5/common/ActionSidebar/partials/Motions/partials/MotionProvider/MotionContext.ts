import { createContext } from 'react';
import { MotionContextValues } from './types';

export const MotionContext = createContext<MotionContextValues | undefined>(
  undefined,
);
