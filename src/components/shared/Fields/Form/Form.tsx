import { yupResolver } from '@hookform/resolvers/yup';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  type Ref,
  useMemo,
} from 'react';
import {
  useForm,
  type UseFormProps,
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type FieldErrors,
  type Resolver,
} from 'react-hook-form';
import { type Schema } from 'yup';

import { type AdditionalFormOptionsContextValue } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import AdditionalFormOptionsContextProvider from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContextProvider.tsx';

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
  reValidateMode?: UseFormProps<FormData>['reValidateMode'];
  options?: UseFormProps<FormData> & AdditionalFormOptionsContextValue;
  /** Pass true to reset the default values to latest values on form submission. This will reset the isDirty prop. */
  resetOnSubmit?: boolean;
  className?: string;
  innerRef?: Ref<UseFormReturn<FormData>>;
  id?: string;
}

const Form = <FormData extends FieldValues>({
  children,
  defaultValues,
  mode = 'onTouched',
  reValidateMode = 'onChange',
  onSubmit,
  onError,
  options,
  resetOnSubmit = false,
  validationSchema,
  className,
  innerRef,
  id,
}: FormProps<FormData>) => {
  const { readonly, ...formOptions } = options || {};
  // Resolver updated to have the access to all of the form values inside a field validator context
  const resolver = useMemo<Resolver<FormData> | undefined>(() => {
    if (!validationSchema) {
      return undefined;
    }

    const yupSchemaResolver = yupResolver(validationSchema);

    return async (values, context = {}, resolverOptions) => {
      const result = await yupSchemaResolver(
        values,
        { ...context, formValues: values },
        resolverOptions,
      );

      return result;
    };
  }, [validationSchema]);
  const formHelpers = useForm({
    resolver,
    defaultValues,
    mode,
    reValidateMode,
    ...formOptions,
  });

  useImperativeHandle(innerRef, () => formHelpers);

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
    <AdditionalFormOptionsContextProvider value={{ readonly }}>
      <FormProvider {...formHelpers}>
        {/* noValidate attribute added to hide native browser validation */}
        <form id={id} className={className} onSubmit={submitHandler} noValidate>
          {typeof children === 'function' ? children(formHelpers) : children}
        </form>
      </FormProvider>
    </AdditionalFormOptionsContextProvider>
  );
};

Form.displayName = displayName;

export default Form;
