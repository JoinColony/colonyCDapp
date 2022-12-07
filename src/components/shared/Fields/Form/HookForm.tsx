import React from 'react';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
  FieldValues,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema } from 'yup';

const displayName = 'HookForm';

export interface HookFormProps<FormData extends FieldValues> {
  children:
    | ((props: UseFormReturn<FormData>) => React.ReactNode)
    | React.ReactNode;
  onSubmit: SubmitHandler<FormData>;
  onError?: SubmitErrorHandler<FormData>;
  validationSchema?: Schema<FormData>;
  defaultValues?: UseFormProps<FormData>['defaultValues'];
  mode?: UseFormProps<FormData>['mode'];
  options?: UseFormProps<FormData>;
}

const HookForm = <FormData extends FieldValues>({
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
