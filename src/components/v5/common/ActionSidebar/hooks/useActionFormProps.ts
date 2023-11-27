import { useCallback, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { ActionFormBaseProps } from '../types';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { ActionTypes } from '~redux';
import { Action } from '~constants/actions';
import { setQueryParamOnUrl } from '~utils/urls';

export const useActionFormProps = (
  defaultValues: ActionFormProps<any>['defaultValues'],
  isReadonly?: boolean,
) => {
  const prevActionTypeRef = useRef<Action | undefined>();
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

      const { defaultValues: formDefaultValues, transform } = formOptions;

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
                    navigate(
                      setQueryParamOnUrl(
                        window.location.pathname,
                        'tx',
                        txHash,
                      ),
                      {
                        replace: true,
                      },
                    );
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

      const { title, [ACTION_TYPE_FIELD_NAME]: actionType } = form.getValues();

      if (prevActionTypeRef.current === actionType) {
        return;
      }

      prevActionTypeRef.current = actionType;

      form.reset({
        ...(typeof formDefaultValues === 'function'
          ? await formDefaultValues()
          : formDefaultValues || {}),
        ...(defaultValues || {}),
        title,
        [ACTION_TYPE_FIELD_NAME]: actionType,
      });
    },
    [isReadonly, defaultValues, navigate],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};
