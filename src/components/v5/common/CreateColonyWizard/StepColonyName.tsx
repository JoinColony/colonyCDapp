import React from 'react';
import { defineMessages } from 'react-intl';

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

const MSG = defineMessages({
  heading: {
    id: 'createColonyWizard.step.colonyName.heading',
    defaultMessage: 'Welcome, {username}!',
  },
  description: {
    id: 'createColonyWizard.step.colonyName.description',
    defaultMessage:
      'Let’s set up your Colony. Enter a name for your Colony and a short description about your Colony’s mission and purpose.',
  },
});

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
          heading={MSG.heading}
          headingValues={{ username }}
          description={MSG.description}
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
