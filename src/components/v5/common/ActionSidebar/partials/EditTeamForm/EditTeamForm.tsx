import React, { FC, PropsWithChildren } from 'react';

import { useEditTeam } from './hooks';
import ActionForm from '../ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.EditTeamForm';

const EditTeamForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useEditTeam}>{children}</ActionForm>
);

EditTeamForm.displayName = displayName;

export default EditTeamForm;
