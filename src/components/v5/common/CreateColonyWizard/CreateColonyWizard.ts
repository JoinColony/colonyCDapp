import { ComponentType } from 'react';

import WizardTemplate from '~frame/WizardTemplate';
import withWizard, { StepsFn, StepType } from '~shared/Wizard/withWizard';
import { Token } from '~types';

import StepColonyName from './StepColonyName';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepConfirmTransactions from './StepConfirmTransactions';
import StepCreateToken from './StepCreateToken';
import StepTokenChoice from './StepTokenChoice';

const stepArray: StepType[] = [
  StepColonyName,
  StepTokenChoice,
  StepCreateToken,
  StepConfirmAllInput,
  StepConfirmTransactions,
];

export type FormValues = {
  tokenName?: string;
  tokenSymbol?: string;
  tokenAddress: string;
  token?: Token | null;
  colonyName: string;
  tokenChoice?: 'create' | 'select';
  tokenChoiceVerify: 'create' | 'select';
  displayName: string;
  tokenAvatar?: string;
  tokenThumbnail?: string;
};

const stepFunction: StepsFn<any> = (step: number): ComponentType<any> => {
  return stepArray[step] as ComponentType<any>;
};

export type Step1 = Pick<FormValues, 'colonyName' | 'displayName'>;
export type Step2 = Pick<FormValues, 'tokenChoice'>;
export type Step3 = Pick<
  FormValues,
  | 'tokenAddress'
  | 'tokenName'
  | 'tokenSymbol'
  | 'token'
  | 'tokenChoice'
  | 'tokenChoiceVerify'
  | 'tokenAvatar'
  | 'tokenThumbnail'
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
    tokenChoiceVerify: 'create',
    tokenAddress: '',
    tokenName: '',
    tokenSymbol: '',
    token: null,
  },
];

export interface WizardProps {
  inviteCode: string;
}

const CreateColonyContainer = withWizard<FormValues, WizardProps>({
  initialValues,
  steps: stepFunction,
})(WizardTemplate);

export default CreateColonyContainer;
