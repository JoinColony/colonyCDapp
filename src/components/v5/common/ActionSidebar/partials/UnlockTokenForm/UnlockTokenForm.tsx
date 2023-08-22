import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useUnlockToken } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.UnlockTokenForm';

const UnlockTokenForm: FC<PropsWithChildren> = ({ children }) => {
  const { methods, onSubmit } = useUnlockToken();

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

UnlockTokenForm.displayName = displayName;

export default UnlockTokenForm;
