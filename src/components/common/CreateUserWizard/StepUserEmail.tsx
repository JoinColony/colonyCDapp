import React from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields';
import { WizardStepProps } from '~shared/Wizard';

import {
  FormValues,
  UserStepTemplate,
  ContinueWizard,
} from '../CreateUserWizard';
import { stepUserEmailValidationSchema as validationSchema } from './validation';
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

const StepUserEmail = ({
  nextStep,
  wizardForm,
}: WizardStepProps<FormValues>) => (
  <Form
    onSubmit={nextStep}
    validationSchema={validationSchema}
    {...wizardForm}
    validateOnChange={false}
  >
    {({ isValid, isSubmitting, setFieldTouched, validateField }) => {
      return (
        <UserStepTemplate
          heading={MSG.heading}
          description={MSG.description}
          input={
            <ConfirmEmail
              onCheckboxChange={() => {
                setFieldTouched('email', true);
                // SetTimeout ensures formik validates with correct state.
                setTimeout(() => validateField('email'), 0);
              }}
              inputDisabled={isSubmitting}
              checkboxDisabled={isSubmitting}
            />
          }
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
  </Form>
);

StepUserEmail.displayName = displayName;

export default StepUserEmail;
