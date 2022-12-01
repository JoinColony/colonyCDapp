import { ComponentType } from 'react';

import WizardTemplate from '~frame/WizardTemplateColony';
import withWizard, { StepsFn, StepType } from '~shared/Wizard/withWizard';

import StepColonyName from './StepColonyName';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepConfirmTransactions from './StepConfirmTransactions';
import StepCreateToken from './StepCreateToken';
import StepSelectToken from './StepSelectToken';
import StepTokenChoice from './StepTokenChoice';

const stepArray: StepType[] = [
  StepColonyName,
  StepTokenChoice,
  StepCreateToken,
  StepConfirmAllInput,
  StepConfirmTransactions,
];

export type FormValues = {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  colonyName: string;
  tokenChoice: 'create' | 'select';
  displayName: string;
};

const pickTokenStep = (tokenChoice: FormValues['tokenChoice']) => {
  if (tokenChoice === 'select') return StepSelectToken;
  return StepCreateToken;
};

/*
 * This is a step function to allow the wizard flow to branch
 * off into two instead of just stepping through an array in a linear manner
 */
const stepFunction: StepsFn<any> = (
  step: number,
  { tokenChoice }: Pick<FormValues, 'tokenChoice'>,
): ComponentType<any> => {
  if (step === 2) {
    return pickTokenStep(tokenChoice);
  }
  return stepArray[step] as ComponentType<any>;
};

export type Step1 = Pick<FormValues, 'colonyName' | 'displayName'>;
export type Step2 = Pick<FormValues, 'tokenChoice'>;
export type Step3 = Pick<
  FormValues,
  'tokenAddress' | 'tokenName' | 'tokenSymbol'
>;

const initialValues: [Step1, Step2, Step3] = [
  {
    colonyName: '',
    displayName: '',
  },
  {
    tokenChoice: 'create',
  },
  {
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
  },
];

const CreateColonyContainer = withWizard<FormValues>({
  initialValues,
  steps: stepFunction,
})(WizardTemplate);

export default CreateColonyContainer;
