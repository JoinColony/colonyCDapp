import React, { FC, PropsWithChildren } from 'react';

import { useEditColonyDetails } from './hooks';
import ActionForm from '../ActionForm/ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useEditColonyDetails}>{children}</ActionForm>
);

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
