import React from 'react';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
} from 'react-hook-form';

const displayName = 'HookForm';

interface HookFormProps {
  options: UseFormProps;
  onSubmit: () => void;
  children: ((props: UseFormReturn) => React.ReactNode) | React.ReactNode;
}

const HookForm = ({ onSubmit, children, options }: HookFormProps) => {
  const formHelpers = useForm(options);
  const { handleSubmit } = formHelpers;
  return (
    <FormProvider {...formHelpers}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(formHelpers) : children}
      </form>
    </FormProvider>
  );
};

HookForm.displayName = displayName;
export default HookForm;
