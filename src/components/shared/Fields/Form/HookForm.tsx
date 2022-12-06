import React from 'react';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema } from 'yup';

const displayName = 'HookForm';

export interface HookFormProps<FormData extends Record<string, any>> {
  children: ((props: UseFormReturn) => React.ReactNode) | React.ReactNode;
  onSubmit: SubmitHandler<FormData>;
  onError?: SubmitErrorHandler<FormData>;
  validationSchema?: Schema<FormData>;
  defaultValues?: UseFormProps['defaultValues'];
  mode?: UseFormProps['mode'];
  options?: UseFormProps;
}

const HookForm = <FormData extends Record<string, any>>({
  children,
  defaultValues,
  mode = 'onTouched',
  onSubmit,
  onError,
  options,
  validationSchema,
}: HookFormProps<FormData>) => {
  const formHelpers = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode,
    ...options,
  });
  const { handleSubmit } = formHelpers;
  return (
    <FormProvider {...formHelpers}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {typeof children === 'function' ? children(formHelpers) : children}
      </form>
    </FormProvider>
  );
};

HookForm.displayName = displayName;
export default HookForm;
