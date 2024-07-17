import { createContext, useContext } from 'react';

import { type FeatureFlagsContextValue } from './types.ts';

export const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({});

export const useFeatureFlagsContext = () => {
  const context = useContext(FeatureFlagsContext);
  return context;
};
