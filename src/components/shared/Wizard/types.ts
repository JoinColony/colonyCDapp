import { type PropsWithChildren } from 'react';

export type StepValues<F> = Partial<F>;
export type StepsValues<F> = StepValues<F>[];

export type InitialValuesProp<F> = F | ((props?: any) => F);

type NextStep = (values?: Record<string, any>) => void;
export type PreviousStep = (values?: Record<string, any>) => boolean;
type WizardReset = () => void;

interface SharedWizardProps<F> {
  step: number;
  stepCount: number;
  nextStep: NextStep;
  previousStep: PreviousStep;
  resetWizard: WizardReset;
  wizardValues: F;
}

export interface WizardOuterProps<
  F extends Record<string, any>,
  T extends Record<string, any>,
> extends PropsWithChildren<SharedWizardProps<F>> {
  templateProps: T;
}

export interface WizardStepProps<
  F,
  Props = Record<string, never>,
  StepVals = Partial<F>,
> extends SharedWizardProps<F> {
  setStepsValues: React.Dispatch<React.SetStateAction<StepsValues<F>>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  wizardProps: Props;
  wizardForm: {
    initialValues: StepVals;
    validateOnMount: boolean;
  };
}
