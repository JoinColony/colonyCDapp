import { StepType } from '~shared/Wizard/withWizard';
import { Token } from '~types';

import StepColonyName from './StepColonyName';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepConfirmTransactions from './StepConfirmTransactions';
import StepCreateToken from './StepCreateToken';
import StepTokenChoice from './StepTokenChoice';

export const stepArray: StepType[] = [
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
  displayName: string;
  tokenAvatar?: string;
  tokenThumbnail?: string;
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
  | 'tokenAvatar'
  | 'tokenThumbnail'
>;

export const initialValues = {
  colonyName: '',
  displayName: '',
  tokenChoice: 'create',
  tokenAddress: '',
  tokenName: '',
  tokenSymbol: '',
  token: null,
};
