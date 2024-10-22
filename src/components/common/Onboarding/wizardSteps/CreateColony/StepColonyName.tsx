import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { Form } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';

import ButtonRow from '../ButtonRow.tsx';
import HeaderRow from '../HeaderRow.tsx';

import NameInputs from './StepColonyNameInputs.tsx';
import { type FormValues, type Step1 } from './types.ts';
import { colonyNameValidationSchema as validationSchema } from './validation.ts';

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
    defaultMessage: 'Let’s set up your Colony. Enter a name and custom URL.',
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
    <Form<Step1>
      onSubmit={nextStep}
      validationSchema={validationSchema}
      mode="onChange"
    >
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
