import { type FieldValues } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import { authenticateWalletWithRetry } from '~auth';
import { type Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { type ActionTypes } from '~redux';
import promiseListener from '~redux/createPromiseListener.ts';
import { TX_SEARCH_PARAM } from '~routes';
import { type OnSuccess } from '~shared/Fields/Form/ActionForm.tsx';
import { type FormProps } from '~shared/Fields/Form/Form.tsx';
import {
  mapPayload,
  pipe,
  withMeta,
  type ActionTransformFnType,
  getFormAction,
} from '~utils/actions.ts';

import { useFormOptions } from '../partials/forms/SimplePaymentForm/hooks.ts';
import SimplePaymentForm from '../partials/forms/SimplePaymentForm/SimplePaymentForm.tsx';

export type UseFormOptionsReturn<V extends FieldValues> = Pick<
  FormProps,
  | 'defaultValues'
  | 'validationSchema'
  | 'mode'
  | 'reValidateMode'
  | 'id'
  | 'onError'
> & {
  transform?: ActionTransformFnType;
  onSuccess?: OnSuccess<V>;
  actionType: ActionTypes | ((values: V) => Promise<ActionTypes>);
};

// FIXME: The following need to be somewhere

// FIXME: Cater for the case where there is no action
export const useActionForm = (action: Action) => {
  const FormComponent = SimplePaymentForm;
  const {
    defaultValues: formDefaultValues = {},
    onError,
    onSuccess,
    transform,
    actionType,
    ...formOptions
  } = useFormOptions();
  const { data } = useActionSidebarContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const formValues =
    typeof formDefaultValues == 'function'
      ? formDefaultValues()
      : formDefaultValues;

  const defaultValues = {
    ...formValues,
    ...data.initialValues,
  };

  const formProps = {
    ...formOptions,
    defaultValues,
    mode: formOptions.mode || 'onChange',
    reValidateMode: formOptions.reValidateMode || 'onChange',
    async onSubmit(values, formHelpers) {
      const setPayload = (reduxAction, payload) => {
        const newAction = transform
          ? transform({ ...reduxAction, payload })
          : { ...reduxAction, payload };
        return {
          ...newAction,
          meta: {
            ...reduxAction.meta,
            ...newAction.meta,
            setTxHash: (txHash: string) => {
              searchParams.set(TX_SEARCH_PARAM, txHash);
              setSearchParams(searchParams);
            },
          },
        };
      };
      const reduxActionType =
        typeof actionType === 'function'
          ? await actionType(values)
          : actionType;
      const { asyncFunction, unsubscribe } =
        promiseListener.createAsyncFunction({
          start: reduxActionType,
          reject: getFormAction(reduxActionType, 'ERROR'),
          resolve: getFormAction(reduxActionType, 'SUCCESS'),
          setPayload,
        });

      try {
        // Force re-auth check to account for loss of auth/connection after the session has been started
        await authenticateWalletWithRetry();
        const res = await asyncFunction(values);
        onSuccess?.(values, formHelpers, res);
      } catch (e) {
        console.error('Error while submitting form', e);
        onError?.(e, formHelpers);
      } finally {
        unsubscribe();
      }
    },
  };
  return { FormComponent, formProps };
};
