import React, { FC, PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';

import { ActionFormProps } from './types';

const displayName = 'v5.common.ActionSidebar.partials.ActionForm';

const ActionForm: FC<PropsWithChildren<ActionFormProps>> = ({
  children,
  useActionHook,
}) => {
  const { methods, onSubmit } = useActionHook();

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

ActionForm.displayName = displayName;

export default ActionForm;
