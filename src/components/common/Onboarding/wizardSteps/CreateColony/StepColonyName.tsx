import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import { useAppContext } from '~hooks';
import { splitWalletAddress } from '~utils/splitWalletAddress';

import { ButtonRow, HeaderRow } from '../shared';

import { FormValues, Step1 } from './CreateColonyWizard';
import { colonyNameValidationSchema as validationSchema } from './validation';

import NameInputs from './StepColonyNameInputs';

const displayName = 'common.CreateColonyWizard.StepColonyName';

type Props = Pick<
  WizardStepProps<FormValues, Step1>,
  'wizardForm' | 'nextStep' | 'wizardValues' | 'previousStep'
>;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Welcome, {username}!',
  },
  description: {
    id: `${displayName}.description`,
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
      <HeaderRow
        heading={MSG.heading}
        headingValues={{ username }}
        description={MSG.description}
      />
      <NameInputs
        displayName={wizardDisplayName}
        colonyName={wizardColonyName}
      />
      <ButtonRow previousStep={previousStep} showBackButton={false} />
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
