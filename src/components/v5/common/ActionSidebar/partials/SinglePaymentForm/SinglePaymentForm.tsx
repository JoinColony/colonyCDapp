import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useSiglePayment } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const SinglePaymentForm: FC<PropsWithChildren> = ({ children }) => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { methods, onSubmit } = useSiglePayment(toggleActionSidebarOff);

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

SinglePaymentForm.displayName = displayName;

export default SinglePaymentForm;
