import React from 'react';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import { useAppContext } from '~hooks';

import { ButtonRow, HeaderRow } from './shared';
import { splitWalletAddress } from '~utils/splitWalletAddress';

import {
  FormValues,
  Step1,
  colonyNameValidationSchema as validationSchema,
} from '../CreateColonyWizard';

import NameInputs from './StepColonyNameInputs';

const displayName = 'common.CreateColonyWizard.StepColonyName';

type Props = Pick<
  WizardStepProps<FormValues, Step1>,
  'wizardForm' | 'nextStep' | 'wizardValues' | 'previousStep'
>;

const StepColonyName = ({
  wizardValues: {
    displayName: wizardDisplayName,
    colonyName: wizardColonyName,
  },
  nextStep,
  previousStep,
}: Props) => {
  const { user } = useAppContext();

  const username =
    user?.profile?.displayName ?? splitWalletAddress(user?.walletAddress ?? '');

  return (
    <Form<Step1> onSubmit={nextStep} validationSchema={validationSchema}>
      <section className="">
        <HeaderRow
          heading={{ id: 'createColonyWizard.step.colonyName.heading' }}
          headingValues={{ username }}
          description={{
            id: 'createColonyWizard.step.colonyName.description',
          }}
        />
        <NameInputs
          displayName={wizardDisplayName}
          colonyName={wizardColonyName}
        />
        <ButtonRow previousStep={previousStep} />
      </section>
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
