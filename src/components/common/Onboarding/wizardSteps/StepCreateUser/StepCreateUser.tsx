import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~v5/shared/Button';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import { withMeta } from '~utils/actions';
import { useAppContext } from '~hooks';

import { HeaderRow } from '../shared';

import { validationSchema } from './validation';
import { CreateUserFormValues } from './types';
import CreateUserFormInputs from './CreateUserFormInputs';
import { WizardStepProps } from '~shared/Wizard';

const displayName = 'common.Onboarding.StepCreateUser';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create your Colony profile',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Connecting an email address enhances your Colony experience, such as receiving notifications about activity, mentions, and comments.',
  },
});

type Props = WizardStepProps<CreateUserFormValues, Record<string, never>>;

const StepCreateUser = ({
  nextStep,
  wizardForm: {
    initialValues: { username, emailAddress },
  },
}: Props) => {
  const { updateUser } = useAppContext();

  return (
    <ActionForm<CreateUserFormValues>
      className="max-w-lg flex flex-col items-end"
      validationSchema={validationSchema}
      defaultValues={{
        username,
        emailAddress,
      }}
      mode="onChange"
      actionType={ActionTypes.USERNAME_CREATE}
      transform={withMeta({ updateUser })}
      onSuccess={nextStep}
    >
      {({ formState: { isSubmitting, isValid } }) => (
        <>
          <HeaderRow heading={MSG.heading} description={MSG.description} />
          <CreateUserFormInputs />
          <Button
            text={{ id: 'button.continue' }}
            type="submit"
            mode="primarySolid"
            disabled={!isValid || isSubmitting}
            className="mt-3"
          />
        </>
      )}
    </ActionForm>
  );
};
StepCreateUser.displayName = displayName;

export default StepCreateUser;
