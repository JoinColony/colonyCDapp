import { AppContextValues } from '~context/AppContext';
import { Values } from '~types';

type WizardValues<T> = Record<string, Values<T>>;
export type StepValues<T> = Partial<WizardValues<T>>;
export type StepsValues<T> = StepValues<T>[];

type StepsValuesFn<T> = (props?: any) => StepsValues<T>;
export type InitialValuesProp<T> = StepsValues<T> | StepsValuesFn<T>;

type NextStep<T> = (values?: StepValues<T>) => void;
type PreviousStep = () => boolean;
type WizardReset = () => void;

interface SharedWizardProps<FormValues> {
  step: number;
  stepCount: number;
  nextStep: NextStep<FormValues>;
  previousStep: PreviousStep;
  resetWizard: WizardReset;
  wizardValues: FormValues;
}

export interface WizardOuterProps<FormValues> extends SharedWizardProps<FormValues> {
  children: JSX.Element;
  loggedInUser: AppContextValues['user'];
  hideQR?: boolean;
}

export interface WizardStepProps<FormValues, StepVals = Partial<FormValues>> extends SharedWizardProps<FormValues> {
  setStepsValues: React.Dispatch<React.SetStateAction<StepsValues<Values<FormValues>>>>;
  wizardForm: {
    initialValues: StepVals;
    validateOnMount: boolean;
  };
}
