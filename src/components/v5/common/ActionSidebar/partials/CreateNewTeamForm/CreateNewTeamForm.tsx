import React, { FC, PropsWithChildren } from 'react';

import { useCrateNewTeam } from './hooks';
import ActionForm from '../ActionForm';

const displayName = 'v5.common.ActionSidebar.partials.CreateNewTeamForm';

const CreateNewTeamForm: FC<PropsWithChildren> = ({ children }) => (
  <ActionForm useActionHook={useCrateNewTeam}>{children}</ActionForm>
);

CreateNewTeamForm.displayName = displayName;

export default CreateNewTeamForm;
