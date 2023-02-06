import React, { ComponentType } from 'react';

import WizardTemplate from '~frame/WizardTemplateColony';
import withWizard, { StepsFn, StepType } from '~shared/Wizard/withWizard';
import { StepUserEmail, StepUserName } from '~common/CreateUserWizard';

import StepColonyName from './StepColonyName';
import StepConfirmAllInput from './StepConfirmAllInput';
import StepConfirmTransactions from './StepConfirmTransactions';
import StepCreateToken from './StepCreateToken';
import StepSelectToken from './StepSelectToken';
import StepTokenChoice from './StepTokenChoice';
import { useAppContext } from '~hooks';
import {
  userStep1,
  userStep2,
  FormValues as UserFormValues,
} from '~common/CreateUserWizard/validation';
import { User } from '~types';

const stepArray: StepType[] = [
  StepUserEmail,
  StepUserName,
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
const StepFunction: StepsFn<any> = (
  step: number,
  { tokenChoice }: Pick<FormValues, 'tokenChoice'>,
): ComponentType<any> => {
  const { user } = useAppContext();
  /* Check if email and skip  */
  let stepArrayNew = stepArray;
  if (user) {
    stepArrayNew = stepArray.filter(
      (stepItem) =>
        stepItem.name !== 'StepUserEmail' && stepItem.name !== 'StepUserName',
    );
  }
  if (tokenChoice) {
    return pickTokenStep(tokenChoice);
  }
  return stepArrayNew[step] as ComponentType<any>;
};

export type Step1 = Pick<FormValues, 'colonyName' | 'displayName'>;
export type Step2 = Pick<FormValues, 'tokenChoice'>;
export type Step3 = Pick<
  FormValues,
  'tokenAddress' | 'tokenName' | 'tokenSymbol'
>;

const initialValues = (user?: User | null) => {
  const guaranteedStepValues: [Step1, Step2, Step3] = [
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
  if (!user) {
    return [userStep1, userStep2, ...guaranteedStepValues];
  }
  return guaranteedStepValues;
};

interface Props {
  user?: User | null;
}

const CreateColonyContainer = ({ user }: Props): React.ReactElement =>
  React.createElement(
    withWizard<UserFormValues>({
      initialValues: initialValues(user),
      steps: StepFunction,
    })(WizardTemplate),
  );

export default CreateColonyContainer;
