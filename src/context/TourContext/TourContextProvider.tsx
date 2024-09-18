import React, { useState, useCallback, useMemo } from 'react';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';

import { type TourTriggerIdentifier } from '~constants/tourTriggers.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';

import { TourContext, type TourContextValue } from './TourContext.ts';

interface TourContextProviderProps {
  children: React.ReactNode;
}

export interface TourStep extends Step {
  triggerIdentifier?: TourTriggerIdentifier;
  triggerPayload?: any;
}

const TourContextProvider: React.FC<TourContextProviderProps> = ({
  children,
}) => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const {
    actionSidebarToggle: [isSidebarOpen, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setStepIndex(0);
    setRun(true);
  }, []);

  const stopTour = useCallback(() => {
    setRun(false);
    setSteps([]);
    setStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({
      run,
      steps,
      stepIndex,
      startTour,
      stopTour,
      nextStep,
      prevStep,
    }),
    [run, steps, stepIndex, startTour, stopTour, nextStep, prevStep],
  );

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, step, type } = data;

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        stopTour();
      } else if (type === 'step:before') {
        const currentStep = step as TourStep;

        if (currentStep.triggerIdentifier) {
          switch (currentStep.triggerIdentifier) {
            case 'OPEN_ACTION_SIDEBAR':
              if (!isSidebarOpen) {
                toggleActionSidebarOn(currentStep.triggerPayload);
              }
              break;
            // Handle other actions
            default:
              break;
          }
        }
      } else if (type === 'step:after') {
        // Increment or decrement stepIndex based on the action
        if (action === 'next') {
          setStepIndex((prevIndex) => prevIndex + 1);
        } else if (action === 'prev') {
          setStepIndex((prevIndex) => prevIndex - 1);
        } else if (action === 'close' || action === 'skip') {
          stopTour();
        }
      }

      // Do not set stepIndex to index directly
    },
    [stopTour, toggleActionSidebarOn, isSidebarOpen],
  );

  return (
    <TourContext.Provider value={value}>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      {children}
    </TourContext.Provider>
  );
};

export default TourContextProvider;
