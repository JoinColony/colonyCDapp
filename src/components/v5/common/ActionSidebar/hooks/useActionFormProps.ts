import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { type CoreAction } from '~actions/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { mapPayload, pipe, withMeta } from '~utils/actions.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';

import {
  ACTION_BASE_VALIDATION_SCHEMA,
  ACTION_TYPE_FIELD_NAME,
} from '../consts.ts';
import { type CreateActionFormProps } from '../types.ts';

const useActionFormProps = (
  defaultValues: ActionFormProps<any>['defaultValues'],
  isReadonly?: boolean,
) => {
  const prevActionTypeRef = useRef<CoreAction | undefined>();
  const navigate = useNavigate();
  const [actionFormProps, setActionFormProps] = useState<ActionFormProps<any>>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    defaultValues,
    children: undefined,
    mode: 'onChange',
    validationSchema: ACTION_BASE_VALIDATION_SCHEMA,
  });

  const getFormOptions = useCallback<CreateActionFormProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }

      const { defaultValues: formDefaultValues, transform } = formOptions;
      const { title, [ACTION_TYPE_FIELD_NAME]: actionType } = form.getValues();

      const formOptionsWithDefaults = {
        ...(typeof formDefaultValues === 'function'
          ? await formDefaultValues()
          : formDefaultValues || {}),
        ...(defaultValues || {}),
        title,
        [ACTION_TYPE_FIELD_NAME]: actionType,
      };

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
        defaultValues: formOptionsWithDefaults,
        children: undefined,
      });

      if (prevActionTypeRef.current === actionType) {
        return;
      }

      prevActionTypeRef.current = actionType;

      form.reset(formOptionsWithDefaults, {
        keepDirtyValues: true,
      });
    },
    [isReadonly, defaultValues, navigate],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};

export default useActionFormProps;
