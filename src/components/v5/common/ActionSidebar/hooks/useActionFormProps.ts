import { useCallback, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { type Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { mapPayload, pipe, withMeta } from '~utils/actions.ts';

import {
  ACTION_BASE_VALIDATION_SCHEMA,
  ACTION_TYPE_FIELD_NAME,
} from '../consts.ts';
import { type ActionFormOptions, type ActionFormBaseProps } from '../types.ts';

const useActionFormProps = (
  defaultValues: ActionFormProps<any>['defaultValues'],
  isReadonly?: boolean,
) => {
  const prevActionTypeRef = useRef<Action | undefined>();
  const navigate = useNavigate();
  const [actionFormProps, setActionFormProps] = useState<ActionFormOptions>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    defaultValues,
    mode: 'onChange',
    onSuccess: () => {},
    validationSchema: ACTION_BASE_VALIDATION_SCHEMA,
  });
  const { colony } = useColonyContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const getFormOptions = useCallback<ActionFormBaseProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }

      const { defaultValues: formDefaultValues, transform } = formOptions;
      const {
        title,
        [ACTION_TYPE_FIELD_NAME]: actionType,
        tokenAddress,
      } = form.getValues();

      const formOptionsWithDefaults = {
        ...(typeof formDefaultValues === 'function'
          ? await formDefaultValues()
          : formDefaultValues || {}),
        ...(defaultValues || {}),
        title,
        [ACTION_TYPE_FIELD_NAME]: actionType,
        tokenAddress:
          tokenAddress ||
          defaultValues?.tokenAddress ||
          colony.nativeToken.tokenAddress,
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
                    searchParams.set(TX_SEARCH_PARAM, txHash);
                    setSearchParams(searchParams);
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
      });

      if (prevActionTypeRef.current === actionType) {
        return;
      }

      prevActionTypeRef.current = actionType;

      form.reset(formOptionsWithDefaults, {
        keepDirtyValues: true,
      });
    },
    [defaultValues, colony.nativeToken.tokenAddress, isReadonly, navigate],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};

export default useActionFormProps;
