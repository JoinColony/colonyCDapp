import React, { FC, PropsWithChildren } from 'react';

import { FormProvider } from 'react-hook-form';
import { useSinglePayment } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const SinglePaymentForm: FC<PropsWithChildren> = ({ children }) => {
  const { methods, onSubmit } = useSinglePayment();

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
