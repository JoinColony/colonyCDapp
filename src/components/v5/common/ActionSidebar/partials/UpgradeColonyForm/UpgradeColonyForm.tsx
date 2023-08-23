import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useUpgradeColony } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.UpgradeColonyForm';

const UpgradeColonyForm: FC<PropsWithChildren> = ({ children }) => {
  const { methods, onSubmit } = useUpgradeColony();

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

UpgradeColonyForm.displayName = displayName;

export default UpgradeColonyForm;
