import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import { ActionForm, Input } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { WizardStepProps } from '~shared/Wizard';
import { pipe, mergePayload, withMeta } from '~utils/actions';
import ConfusableWarning from '~shared/ConfusableWarning';

import { stepUserNameValidationSchema as validationSchema } from './validationCreateUserWizard';
import {
  FormValues,
  ContinueWizard,
  UserStepTemplate,
} from '../CreateUserWizard';

type Props = Pick<
  WizardStepProps<FormValues>,
  'nextStep' | 'wizardValues' | 'wizardForm'
>;

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
  username: string;
  disabled: boolean;
}
const UsernameInput = ({ username, disabled }: UsernameInputProps) => (
  <>
    <Input
      appearance={{ theme: 'fat' }}
      name="username"
      label={MSG.label}
      formattingOptions={{ blocks: [100] }}
      disabled={disabled}
    />
    {username && isConfusing(username) && <ConfusableWarning />}
  </>
);

const StepUserName = ({ wizardValues, nextStep, wizardForm }: Props) => {
  const navigate = useNavigate();

  const transform = pipe(
    mergePayload({
      ...wizardValues,
    }),
    withMeta({ navigate }),
  );

  return (
    <ActionForm
      onSuccess={() => nextStep(wizardValues)}
      submit={ActionTypes.USERNAME_CREATE}
      success={ActionTypes.TRANSACTION_CREATED}
      error={ActionTypes.USERNAME_CREATE_ERROR}
      transform={transform}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ dirty, isValid, isSubmitting, values }) => (
        <UserStepTemplate
          heading={MSG.heading}
          description={MSG.description}
          descriptionValues={{ br: <br /> }}
          input={
            <UsernameInput username={values.username} disabled={isSubmitting} />
          }
          button={
            <ContinueWizard
              disabled={!isValid || !dirty || isSubmitting}
              loading={isSubmitting}
              data-test="claimUsernameConfirm"
            />
          }
        />
      )}
    </ActionForm>
  );
};

StepUserName.displayName = displayName;

export default StepUserName;
