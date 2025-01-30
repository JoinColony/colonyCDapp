import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { withMeta } from '~utils/actions.ts';
import Button from '~v5/shared/Button/index.ts';

import HeaderRow from '../HeaderRow.tsx';

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
  const { user, updateUser } = useAppContext();
  const { user: dynamicWalletUser } = useDynamicContext();

  if (user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  const transformWithMeta = withMeta({
    updateUser,
  });
  return (
    <ActionForm<CreateUserFormValues>
      className="flex max-w-lg flex-col items-end"
      validationSchema={validationSchema}
      defaultValues={{
        username,
        emailAddress: dynamicWalletUser?.email || emailAddress,
      }}
      mode="onChange"
      actionType={ActionTypes.USERNAME_CREATE}
      transform={transformWithMeta}
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
