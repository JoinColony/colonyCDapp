import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import HookForm from '~shared/Fields/Form/HookForm';

import {
  FormValues,
  UserStepTemplate,
  ContinueWizard,
} from '../CreateUserWizard';
import {
  stepUserEmailValidationSchema as validationSchema,
  UserWizardStep1,
} from './validation';
import ConfirmEmail from './ConfirmEmail';

export const displayName = 'common.CreateUserWizard.StepUserEmail';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: "Welcome to Colony, let's get started!",
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Enter your email address below to enhance your experience.',
  },
});

type Props = WizardStepProps<FormValues, UserWizardStep1>;

const StepUserEmail = ({
  nextStep,
  wizardForm: { initialValues: defaultValues },
}: Props) => {
  return (
    <HookForm<UserWizardStep1>
      validationSchema={validationSchema}
      defaultValues={defaultValues}
      onSubmit={nextStep}
    >
      {({ formState: { isSubmitting, isValid } }) => {
        return (
          <UserStepTemplate
            heading={MSG.heading}
            description={MSG.description}
            input={<ConfirmEmail />}
            button={
              <ContinueWizard
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                data-test="claimUsernameConfirm"
              />
            }
          />
        );
      }}
    </HookForm>
  );
};
StepUserEmail.displayName = displayName;

export default StepUserEmail;
