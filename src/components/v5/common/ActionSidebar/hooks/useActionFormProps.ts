import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { ActionFormBaseProps } from '../types';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { ActionTypes } from '~redux';

export const useActionFormProps = (
  defaultValues: ActionFormProps<any>['defaultValues'],
  isReadonly?: boolean,
) => {
  const navigate = useNavigate();
  const [actionFormProps, setActionFormProps] = useState<ActionFormProps<any>>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    defaultValues,
    children: undefined,
  });
  const getFormOptions = useCallback<ActionFormBaseProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }

      const {
        defaultValues: formDefaultValues,
        transform,
        actionType: formAction,
      } = formOptions;

      setActionFormProps({
        ...formOptions,
        ...(transform
          ? {
              transform: pipe(
                transform,
                mapPayload((payload) => ({
                  ...(payload || {}),
                  customActionTitle: form.getValues('title') || '',
                })),
                withMeta({
                  setTxHash: (txHash: string) => {
                    navigate(`${window.location.pathname}?tx=${txHash}`, {
                      replace: true,
                    });
                  },
                }),
              ),
            }
          : {}),
        options: {
          readonly: isReadonly,
          ...formOptions.options,
        },
        children: undefined,
      });

      if (actionFormProps.actionType !== formAction) {
        return;
      }

      const { title, [ACTION_TYPE_FIELD_NAME]: actionType } = form.getValues();

      form.reset({
        ...(typeof formDefaultValues === 'function'
          ? await formDefaultValues()
          : formDefaultValues || {}),
        ...(defaultValues || {}),
        title,
        [ACTION_TYPE_FIELD_NAME]: actionType,
      });
    },
    [isReadonly, actionFormProps.actionType, defaultValues, navigate],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};
