import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext.tsx';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { withMeta } from '~utils/actions.ts';
import Button from '~v5/shared/Button/index.ts';

import { HeaderRow } from '../shared.tsx';

import CreateUserFormInputs from './CreateUserFormInputs.tsx';
import { type CreateUserFormValues } from './types.ts';
import { validationSchema } from './validation.ts';

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
      transform={withMeta({
        updateUser,
      })}
      onSuccess={nextStep}
    >
      {({ formState: { isSubmitting } }) => (
        <>
          <HeaderRow heading={MSG.heading} description={MSG.description} />
          <CreateUserFormInputs />
          <Button
            text={{ id: 'button.continue' }}
            type="submit"
            mode="primarySolid"
            disabled={isSubmitting}
            className="mt-12"
          />
        </>
      )}
    </ActionForm>
  );
};
StepCreateUser.displayName = displayName;

export default StepCreateUser;
