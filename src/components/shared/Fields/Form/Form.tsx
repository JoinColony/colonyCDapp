import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema } from 'yup';
import AdditionalFormOptionsContextProvider from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { AdditionalFormOptionsContextValue } from '~context/AdditionalFormOptionsContext/types';
import { TransactionGroupStates, useUserTransactionContext } from '~context';

const displayName = 'Form';

export type CustomSubmitHandler<FormData extends FieldValues> = (
  data: FormData,
  formHelpers: UseFormReturn<FormData>,
  event?: React.BaseSyntheticEvent,
) => any | Promise<any>;
export type CustomSubmitErrorHandler<FormData extends FieldValues> = (
  errors: FieldErrors<FormData>,
  formHelpers: UseFormReturn<FormData, any>,
  event?: React.BaseSyntheticEvent,
) => any | Promise<any>;

export interface FormProps<FormData extends FieldValues> {
  children:
    | ((props: UseFormReturn<FormData>) => React.ReactNode)
    | React.ReactNode;
  onSubmit: CustomSubmitHandler<FormData>;
  onError?: CustomSubmitErrorHandler<FormData>;
  validationSchema?: Schema<FormData>;
  defaultValues?: UseFormProps<FormData>['defaultValues'];
  mode?: UseFormProps<FormData>['mode'];
  options?: UseFormProps<FormData> & AdditionalFormOptionsContextValue;
  /** Pass true to reset the default values to latest values on form submission. This will reset the isDirty prop. */
  resetOnSubmit?: boolean;
  className?: string;
}

const Form = <FormData extends FieldValues>(
  {
    children,
    defaultValues,
    mode = 'onTouched',
    onSubmit,
    onError,
    options,
    resetOnSubmit = false,
    validationSchema,
    className,
  }: FormProps<FormData>,
  ref: React.ForwardedRef<UseFormReturn<FormData, any, undefined>>,
) => {
  const { readonly, ...formOptions } = options || {};
  const { groupState } = useUserTransactionContext();
  const formHelpers = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode,
    ...formOptions,
  });

  useImperativeHandle(ref, () => formHelpers);

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
  }, [isSubmitting, values, resetOnSubmit, reset]);

  const submitHandler = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (event) => {
      // We need stopPropagation to prevent the form from submitting parent
      // forms because events propagate trough ReactDOM so event if
      // html form elements are not nested this would submit parent form
      event.stopPropagation();

      const handler = handleSubmit(
        (data, e) => onSubmit(data, formHelpers, e),
        (errors, e) => onError && onError(errors, formHelpers, e),
      );

      return handler(event);
    },
    [handleSubmit, onSubmit, formHelpers, onError],
  );

  return (
    <AdditionalFormOptionsContextProvider
      value={{
        readonly,
        isActionPending: groupState === TransactionGroupStates.SomePending,
      }}
    >
      <FormProvider {...formHelpers}>
        <form className={className} onSubmit={submitHandler}>
          {typeof children === 'function' ? children(formHelpers) : children}
        </form>
      </FormProvider>
    </AdditionalFormOptionsContextProvider>
  );
};

Form.displayName = displayName;

export default React.forwardRef(Form);
