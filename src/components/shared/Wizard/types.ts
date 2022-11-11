import { User, Values } from '~types';

type WizardValues<T> = Record<string, Values<T>>;
export type StepValue<T> = Partial<WizardValues<T>>;
export type StepValues<T> = StepValue<T>[];

type StepValuesFn<T> = (props?: any) => StepValue<T>[];
export type InitialValuesProp<T> = StepValues<T> | StepValuesFn<T>;

type NextStep<T> = (values?: StepValue<T>) => void;
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

export interface WizardOuterProps<FormValues>
  extends SharedWizardProps<FormValues> {
  children: JSX.Element;
  loggedInUser?: User;
  hideQR?: boolean;
}

export interface WizardStepProps<FormValues>
  extends SharedWizardProps<FormValues> {
  setStepsValues: React.Dispatch<
    React.SetStateAction<StepValues<Values<FormValues>>>
  >;
  wizardForm: {
    initialValues: StepValue<FormValues>;
    validateOnMount: boolean;
  };
}
