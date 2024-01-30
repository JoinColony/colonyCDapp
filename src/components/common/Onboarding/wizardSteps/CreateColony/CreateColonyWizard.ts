import { type StepType } from '~shared/Wizard/withWizard.tsx';

import StepColonyName from './StepColonyName.tsx';
import StepConfirmAllInput from './StepConfirmAllInput.tsx';
import StepConfirmTransactions from './StepConfirmTransactions.tsx';
import StepCreateToken from './StepCreateToken.tsx';
import StepTokenChoice from './StepTokenChoice.tsx';
import { TokenChoice } from './types.ts';

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
