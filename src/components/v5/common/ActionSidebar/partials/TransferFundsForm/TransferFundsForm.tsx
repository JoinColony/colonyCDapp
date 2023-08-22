import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useTransferFundsForm } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.TransferFundsForm';

const TransferFundsForm: FC<PropsWithChildren> = ({ children }) => {
  const { methods, onSubmit } = useTransferFundsForm();

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

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
