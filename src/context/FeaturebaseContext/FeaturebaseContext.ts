import { createContext, useContext } from 'react';

export interface FeaturebaseContextValues {
  isFeaturebaseBooted: boolean;
}

export const FeaturebaseContext = createContext<
  FeaturebaseContextValues | undefined
>(undefined);

export const useFeaturebaseContext = () => {
  const context = useContext(FeaturebaseContext);
  if (!context) {
    throw new Error(
      'useFeaturebaseContext must be used within a FeaturebaseProvider',
    );
  }
  return context;
};
