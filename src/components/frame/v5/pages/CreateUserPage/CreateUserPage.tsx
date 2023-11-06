import React from 'react';

import WizardTemplate from '~frame/WizardTemplate';
import CreateUserForm from '~v5/common/CreateUserForm';

const displayName = 'frame.CreateUserPage';

const CreateUserPage = () => (
  <WizardTemplate>
    <CreateUserForm />
  </WizardTemplate>
);

CreateUserPage.displayName = displayName;

export default CreateUserPage;
