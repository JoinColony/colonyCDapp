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
import { useStableDepsEffect } from '~hooks/useStableDepsEffect.ts';

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
  testId?: string;
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
  testId,
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
    getValues,
    formState: { isSubmitting, errors: formErrors },
  } = formHelpers;
  const values = watch();

  /*
   * Effect resets default values to latest values, which resets the isDirty prop.
   * Useful in user settings.
   */
  useEffect(() => {
    if (isSubmitting && resetOnSubmit && !Object.keys(formErrors)) {
      reset(values);
    }
  }, [isSubmitting, values, resetOnSubmit, reset, formErrors]);

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

  // Separate concern for handling defaultValues updates
  useStableDepsEffect(() => {
    const initializeForm = async () => {
      const resolvedDefaultValues =
        typeof defaultValues === 'function'
          ? await defaultValues()
          : defaultValues;

      const currentValues = getValues();
      const mergedValues = { ...resolvedDefaultValues, ...currentValues };

      reset(mergedValues, { keepDirtyValues: true, keepValues: true });
    };

    initializeForm();
  }, [defaultValues, reset, getValues]);

  return (
    <AdditionalFormOptionsContextProvider value={{ readonly }}>
      <FormProvider {...formHelpers}>
        {/* noValidate attribute added to hide native browser validation */}
        <form
          id={id}
          className={className}
          onSubmit={submitHandler}
          noValidate
          data-testid={testId}
        >
          {typeof children === 'function' ? children(formHelpers) : children}
        </form>
      </FormProvider>
    </AdditionalFormOptionsContextProvider>
  );
};

Form.displayName = displayName;

export default Form;
