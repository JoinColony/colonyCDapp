import { StepType } from '~shared/Wizard/withWizard';

import { TokenChoice } from './types';
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

export const initialValues = {
  colonyName: '',
  displayName: '',
  tokenChoice: TokenChoice.Create,
  tokenAddress: '',
  tokenName: '',
  tokenSymbol: '',
  token: null,
};
