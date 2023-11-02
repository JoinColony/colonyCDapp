import React from 'react';

import { ActionTypes } from '~redux';

import { ActionForm } from '~shared/Fields';
import CreateUserForm, { validationSchema } from '~v5/common/CreateUserForm';

const displayName = 'frame.CreateUserPage';

const CreateUserPage = () => {
  return (
    <main className="flex flex-col items-center">
      <article className="max-w-[33.125rem]">
        <ActionForm
          className="max-w-lg flex flex-col items-end"
          validationSchema={validationSchema}
          defaultValues={{
            username: '',
            emailAddress: '',
            emailPermissions: [],
          }}
          mode="onChange"
          actionType={ActionTypes.USERNAME_CREATE}
        >
          <CreateUserForm />
        </ActionForm>
      </article>
    </main>
  );
};

CreateUserPage.displayName = displayName;

export default CreateUserPage;
