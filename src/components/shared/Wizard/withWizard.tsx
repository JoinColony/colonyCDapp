import React, { ComponentType, useState } from 'react';

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

interface WizardArgs<F, T> {
  initialValues?: InitialValuesProp<F>;
  stepCount?: number;
  steps: Steps;
  templateProps?: T;
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
  <
    P extends Record<string, any> = Record<string, any>,
    F extends Record<string, any> = Record<string, any>,
    T extends Record<string, any> = Record<string, any>,
  >({
    initialValues: initialValuesProp = {} as F,
    steps,
    stepCount: maxSteps,
    templateProps = {} as T,
  }: WizardArgs<F, T>) =>
  (
    OuterComponent: ComponentType<WizardOuterProps<F, T>>,
    stepsProps?: WizardStepProps<F, P, Partial<F>>,
  ) => {
    const Wizard = (wizardProps: P = {} as P) => {
      const [currentStep, setCurrentStep] = useState(0);

      const [stepsValues, setStepsValues] = useState<StepsValues<F>>([]);
      const mergedValues = all(stepsValues) as F;

      const Step = getStep(steps, currentStep, mergedValues);
      if (!Step) throw new Error('Step needs to be implemented!');

      const stepCount = maxSteps || steps.length;

      const next = (vals: StepValues<F> | undefined) => {
        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];

            // Update current step values
            valsCopy[currentStep] = vals;

            // Check if next step exists
            if (currentStep + 1 < valsCopy.length) {
              // Get keys of the current vals object
              const keys = Object.keys(vals) as Array<keyof Partial<F>>;

              // Update values in the next step if they have the same key as in the current step
              keys.forEach((key) => {
                if (
                  Object.prototype.hasOwnProperty.call(vals, key) &&
                  Object.prototype.hasOwnProperty.call(
                    valsCopy[currentStep + 1],
                    key,
                  )
                ) {
                  valsCopy[currentStep + 1][key] = vals[key];
                }
              });
            }

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

            // Update current step values
            valsCopy[currentStep] = vals;

            // Check if previous step exists
            if (currentStep - 1 >= 0) {
              // Get keys of the current vals object
              const keys = Object.keys(vals) as Array<keyof Partial<F>>;

              // Update values in the previous step if they have the same key as in the current step
              keys.forEach((key) => {
                if (
                  Object.prototype.hasOwnProperty.call(vals, key) &&
                  Object.prototype.hasOwnProperty.call(
                    valsCopy[currentStep - 1],
                    key,
                  )
                ) {
                  valsCopy[currentStep - 1][key] = vals[key];
                }
              });
            }
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
      return (
        <OuterComponent
          step={currentStep}
          stepCount={stepCount}
          nextStep={next}
          previousStep={prev}
          resetWizard={reset}
          wizardValues={mergedValues}
          templateProps={templateProps}
        >
          <Step
            step={currentStep}
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
              // Get values for this step
              initialValues: stepValues || initialValues || {},
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
