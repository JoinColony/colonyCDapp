import React, { ComponentType, useState } from 'react';

import { useAppContext } from '~hooks';
import { User, Values } from '~types';

import {
  InitialValuesProp,
  StepValue,
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

const getStep = <T,>(
  steps: Steps,
  step: number,
  values: T,
  loggedInUser?: User,
) =>
  typeof steps === 'function' ? steps(step, values, loggedInUser) : steps[step];

const all = <T,>(values: StepValues<T>) =>
  values.reduce(
    (acc, current) => ({
      ...acc,
      ...current,
    }),
    {},
  );

const withWizard =
  <T,>({
    initialValues: initialValuesProp = [],
    steps,
    stepCount: maxSteps,
  }: WizardArgs<Values<T>>) =>
  (
    OuterComponent: ComponentType<WizardOuterProps<T>>,
    stepsProps?: WizardStepProps<T>,
  ): (() => JSX.Element) => {
    const Wizard = () => {
      const { user } = useAppContext();
      const [step, setStep] = useState(0);

      const [stepsValues, setStepsValues] = useState<StepValues<T>>([]);
      const mergedValues = all(stepsValues) as T;

      const Step = getStep(steps, step, mergedValues, user);
      if (!Step) throw new Error('Step needs to be implemented!');

      const displayedStep = step + 1;
      const stepCount = maxSteps || steps.length;

      const next = (vals: StepValue<T> | undefined) => {
        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];
            valsCopy[step] = vals;
            return valsCopy;
          });
        }
        setStep((wizardStep) => wizardStep + 1);
      };

      const prev = () => {
        if (step === 0) {
          return false;
        }
        setStep((wizardStep) => (wizardStep === 0 ? 0 : wizardStep - 1));
        return true;
      };

      const reset = () => {
        setStep(0);
        setStepsValues([]);
      };

      const stepValues = stepsValues[step];
      const initialValues =
        typeof initialValuesProp === 'function'
          ? initialValuesProp(user)
          : initialValuesProp;
      const initialStepValues = initialValues[step];
      return (
        <OuterComponent
          step={displayedStep}
          stepCount={stepCount}
          nextStep={next}
          previousStep={prev}
          resetWizard={reset}
          wizardValues={mergedValues}
          loggedInUser={user}
        >
          <Step
            step={displayedStep}
            stepCount={stepCount}
            nextStep={next}
            previousStep={prev}
            resetWizard={reset}
            setStepsValues={setStepsValues}
            wizardValues={mergedValues}
            // Wizard form helpers to take some shortcuts if needed
            wizardForm={{
              // Get values just for this step
              initialValues: stepValues || initialStepValues || {},
              // It should be valid if we submitted values for this step before
              validateOnMount: !!stepsValues,
            }}
            {...stepsProps}
          />
        </OuterComponent>
      );
    };

    return Wizard;
  };

export default withWizard;
