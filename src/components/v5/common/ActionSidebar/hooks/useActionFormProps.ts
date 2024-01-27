import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Action } from '~constants/actions.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { mapPayload, pipe, withMeta } from '~utils/actions.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.tsx';
import { ActionFormBaseProps } from '../types.ts';

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

      form.reset(
        {
          ...(typeof formDefaultValues === 'function'
            ? await formDefaultValues()
            : formDefaultValues || {}),
          ...(defaultValues || {}),
          title,
          [ACTION_TYPE_FIELD_NAME]: actionType,
        },
        {
          keepDirtyValues: true,
        },
      );
    },
    [isReadonly, defaultValues, navigate],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};
