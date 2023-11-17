import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Button from '~v5/shared/Button';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields';
import { withMeta } from '~utils/actions';
import { useAppContext } from '~hooks';

import { HeaderRow } from '../CreateColonyWizard/shared';

import { validationSchema } from './validation';
import { CreateUserFormValues } from './types';
import CreateUserFormInputs from './CreateUserFormInputs';

const displayName = 'common.CreateUserForm';

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

const CreateUserForm = () => {
  const navigate = useNavigate();
  const { updateUser } = useAppContext();

  return (
    <ActionForm<CreateUserFormValues>
      className="max-w-lg flex flex-col items-end"
      validationSchema={validationSchema}
      defaultValues={{
        username: '',
        emailAddress: '',
        emailPermissions: [],
      }}
      mode="onChange"
      actionType={ActionTypes.USERNAME_CREATE}
      transform={withMeta({ navigate, updateUser })}
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
            className="mt-3"
          />
        </>
      )}
    </ActionForm>
  );
};
CreateUserForm.displayName = displayName;

export default CreateUserForm;
