import React from 'react';
import { defineMessages } from 'react-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormProps } from 'react-hook-form';

import { WizardStepProps } from '~shared/Wizard';
import HookForm from '~shared/Fields/Form/HookForm';

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

type StepValues = Pick<FormValues, 'email' | 'emailPermissions'>;
type Props = WizardStepProps<FormValues, StepValues>;

const StepUserEmail = ({ nextStep, wizardForm }: Props) => {
  const formOptions: UseFormProps = {
    defaultValues: wizardForm.initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  };
  return (
    <HookForm options={formOptions} onSubmit={nextStep}>
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
