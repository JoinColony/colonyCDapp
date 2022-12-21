import React, { useEffect } from 'react';
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
  /** Pass true to reset the default values to latest values on form submission. This will reset the isDirty prop. */
  resetOnSubmit?: boolean;
}

const HookForm = <FormData extends FieldValues>({
  children,
  defaultValues,
  mode = 'onTouched',
  onSubmit,
  onError,
  options,
  resetOnSubmit = false,
  validationSchema,
}: HookFormProps<FormData>) => {
  const formHelpers = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode,
    ...options,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = formHelpers;
  const values = watch();

  /*
   * Effect resets default values to latest values, which resets the isDirty prop.
   * Useful in user settings.
   */
  useEffect(() => {
    if (isSubmitting && resetOnSubmit) {
      reset(values);
    }
  }, [isSubmitting, values]);

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
