import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { HookFormInput as Input } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { WizardStepProps } from '~shared/Wizard';
import { mergePayload } from '~utils/actions';
import ActionHookForm from '~shared/Fields/Form/ActionHookForm';
import { LANDING_PAGE_ROUTE } from '~routes';

import {
  FormValues,
  ContinueWizard,
  UserStepTemplate,
} from '../CreateUserWizard';
import {
  stepUserNameValidationSchema as validationSchema,
  UserWizardStep2,
} from './validation';

const displayName = 'common.CreateUserWizard.StepUserName';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create your user account',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `To use Colony, you must create a username for your account.
    {br}Choose carefully, it is not possible to change your username later.`,
  },
  label: {
    id: `${displayName}.label`,
    defaultMessage: 'Your Unique Username',
  },
});

interface UsernameInputProps {
  disabled: boolean;
}

const formattingOptions = { blocks: [255] };

const UsernameInput = ({ disabled }: UsernameInputProps) => (
  <Input
    appearance={{ theme: 'fat' }}
    name="username"
    label={MSG.label}
    formattingOptions={formattingOptions}
    disabled={disabled}
    showConfusable
  />
);

type Props = WizardStepProps<FormValues, UserWizardStep2>;

const StepUserName = ({
  wizardValues,
  wizardForm: { initialValues: defaultValues },
}: Props) => {
  const navigate = useNavigate();
  const transform = mergePayload(wizardValues);
  /* Replace: true so you can't get back to the User wizard after completion */
  const handleSuccess = () => navigate(LANDING_PAGE_ROUTE, { replace: true });

  return (
    <ActionHookForm<UserWizardStep2>
      submit={ActionTypes.USERNAME_CREATE}
      success={ActionTypes.USERNAME_CREATE_SUCCESS}
      error={ActionTypes.USERNAME_CREATE_ERROR}
      onSuccess={handleSuccess}
      transform={transform}
      validationSchema={validationSchema}
      defaultValues={defaultValues}
    >
      {({ formState: { isValid, isSubmitting, isSubmitted, isDirty } }) => (
        <UserStepTemplate
          heading={MSG.heading}
          description={MSG.description}
          descriptionValues={{ br: <br /> }}
          input={<UsernameInput disabled={isSubmitting || isSubmitted} />}
          button={
            <ContinueWizard
              disabled={!isValid || !isDirty || isSubmitting}
              loading={isSubmitting}
              data-test="claimUsernameConfirm"
            />
          }
        />
      )}
    </ActionHookForm>
  );
};

StepUserName.displayName = displayName;

export default StepUserName;
