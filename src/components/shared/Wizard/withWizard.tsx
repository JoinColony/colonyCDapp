import React, { ComponentType, useState } from 'react';

import { useWizardContext } from '~routes/WizardRoute/WizardLayout';

import {
  InitialValuesProp,
  StepsValues,
  StepValues,
  WizardOuterProps,
  WizardStepProps,
} from './types';

export type StepType = ComponentType<any> & { stepName?: string };

export type StepsFn<T> = (step: number, values: any, props?: T) => StepType;

type Steps = StepType[] | StepsFn<any>;

interface WizardArgs<T> {
  initialValues?: InitialValuesProp<T>;
  stepCount?: number;
  steps: Steps;
}

const getStep = <T,>(steps: Steps, step: number, values: T) =>
  typeof steps === 'function' ? steps(step, values) : steps[step];

const all = <T,>(values: StepsValues<T>) =>
  values.reduce(
    (acc, current) => ({
      ...acc,
      ...current,
    }),
    {},
  );

const withWizard =
  <F, P = Record<string, never>>({
    initialValues: initialValuesProp = [],
    steps,
    stepCount: maxSteps,
  }: WizardArgs<F>) =>
  (
    OuterComponent: ComponentType<WizardOuterProps<F>>,
    stepsProps?: WizardStepProps<F, P, Partial<F>>,
  ) => {
    const Wizard = (wizardProps: P) => {
      const { currentStep, setCurrentStep } = useWizardContext();

      const [stepsValues, setStepsValues] = useState<StepsValues<F>>([]);
      const mergedValues = all(stepsValues) as F;

      const Step = getStep(steps, currentStep, mergedValues);
      if (!Step) throw new Error('Step needs to be implemented!');

      const displayedStep = currentStep + 1;
      const stepCount = maxSteps || steps.length;

      const next = (vals: StepValues<F> | undefined) => {
        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];
            valsCopy[currentStep] = vals;
            return valsCopy;
          });
        }
        setCurrentStep(currentStep + 1);
      };

      const prev = (vals: StepValues<F> | undefined) => {
        if (currentStep === 0) {
          return false;
        }

        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];
            valsCopy[currentStep] = vals;
            return valsCopy;
          });
        }

        setCurrentStep(currentStep === 0 ? 0 : currentStep - 1);
        return true;
      };

      const reset = () => {
        setStepsValues([]);
        setCurrentStep(0);
      };

      const stepValues = stepsValues[currentStep];
      const initialValues =
        typeof initialValuesProp === 'function'
          ? initialValuesProp()
          : initialValuesProp;
      const initialStepValues = initialValues[currentStep];
      return (
        <OuterComponent
          step={displayedStep}
          stepCount={stepCount}
          nextStep={next}
          previousStep={prev}
          resetWizard={reset}
          wizardValues={mergedValues}
        >
          <Step
            step={displayedStep}
            stepCount={stepCount}
            nextStep={next}
            previousStep={prev}
            setStep={setCurrentStep}
            resetWizard={reset}
            setStepsValues={setStepsValues}
            wizardValues={mergedValues}
            wizardProps={wizardProps}
            // Wizard form helpers to take some shortcuts if needed
            wizardForm={{
              // Get values just for this step
              initialValues: stepValues || initialStepValues || {},
              // It should be valid if we submitted values for this step before
              validateOnMount: !!stepsValues,
            }}
            {...stepsProps}
            {...wizardProps}
          />
        </OuterComponent>
      );
    };

    return Wizard;
  };

export default withWizard;
