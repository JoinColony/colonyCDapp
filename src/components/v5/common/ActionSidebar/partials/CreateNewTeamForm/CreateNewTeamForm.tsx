import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useCrateNewTeam } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.CreateNewTeamForm';

const CreateNewTeamForm: FC<PropsWithChildren> = ({ children }) => {
  const { methods, onSubmit } = useCrateNewTeam();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        {children}
      </form>
    </FormProvider>
  );
};

CreateNewTeamForm.displayName = displayName;

export default CreateNewTeamForm;
