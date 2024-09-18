import { createContext, useContext } from 'react';

import { type TourStep } from '~context/TourContext/TourContextProvider.tsx';

export interface TourContextValue {
  run: boolean;
  steps: TourStep[];
  stepIndex: number;
  startTour: (tourSteps: TourStep[]) => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const TourContext = createContext<TourContextValue>({
  run: false,
  steps: [],
  stepIndex: 0,
  startTour: () => {},
  stopTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
});

export const useTourContext = (): TourContextValue => {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error(
      'The "useTourContext" hook must be used within a "TourContextProvider"',
    );
  }

  return context;
};
