import React, { useEffect } from 'react';
import { ActionTypes } from '~redux';

import { useColonyCreationFlowContext } from '~routes/WizardRoute/WizardLayout';

import { ActionForm } from '~shared/Fields';
import CreateUserForm, { validationSchema } from '~v5/common/CreateUserForm';

const displayName = 'frame.CreateUserPage';

const CreateUserPage = () => {
  const { setCurrentStep } = useColonyCreationFlowContext();

  useEffect(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  return (
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
  );
};

CreateUserPage.displayName = displayName;

export default CreateUserPage;
