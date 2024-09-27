import { createContext, useContext } from 'react';
import { type Step } from 'react-joyride';

export interface TourContextValue {
  run: boolean;
  steps: Step[];
  stepIndex: number;
  startTour: (tourSteps: Step[]) => void;
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
