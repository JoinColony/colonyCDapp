import { noop } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { type Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux';
import { TX_SEARCH_PARAM } from '~routes';
import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { mapPayload, pipe, withMeta } from '~utils/actions.ts';

import { ACTION_BASE_VALIDATION_SCHEMA } from '../consts.ts';
import {
  type ActionFormOptions,
  type CreateActionFormProps,
} from '../types.ts';

const useActionFormProps = (
  defaultValues: ActionFormProps<any>['defaultValues'],
) => {
  const prevActionTypeRef = useRef<Action | undefined>();
  const [actionFormProps, setActionFormProps] = useState<ActionFormOptions>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    defaultValues,
    mode: 'onChange',
    validationSchema: ACTION_BASE_VALIDATION_SCHEMA,
    onSuccess: noop,
    primaryButton: {
      type: 'submit',
    },
  });
  const { colony } = useColonyContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // FIXME: Check if we still need that
  // This ensures that actionFormProps always receives the freshest defaultValues updates
  // useEffect(() => {
  //   if (defaultValues) {
  //     setActionFormProps((state) => ({
  //       ...state,
  //       defaultValues: {
  //         ...state.defaultValues,
  //         ...defaultValues,
  //       },
  //     }));
  //   }
  // }, [defaultValues]);

  // FIXME: This is basically just to set the form options OUTSIDE of the component from the INSIDE of the component.
  // START HERE. Recreate the CreateActionLayout component, then wrap all actions in it,
  // then feed it these options
  // Use most of the stuff of CreateActionSidebar for the layout

  const getDefaultFormOptions = () => {};

  const getFormOptions = useCallback<CreateActionFormProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }
      console.log(formOptions);

      // formOptions = { actionType: formOptions.actionType };
      const { defaultValues: formDefaultValues, transform } = formOptions;
      const { title, tokenAddress } = form.getValues();

      const formOptionsWithDefaults = {
        ...(typeof formDefaultValues === 'function'
          ? await formDefaultValues()
          : formDefaultValues || {}),
        ...(defaultValues || {}),
        // FIXME: What happens if we remove these
        // title,
        // tokenAddress:
        //   tokenAddress ||
        //   defaultValues?.tokenAddress ||
        //   colony.nativeToken.tokenAddress,
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
                // FIXME: OH MY FUCKING GOD THIS HAS SIDE EFFECTS
                // withMeta({
                //   setTxHash: (txHash: string) => {
                //     searchParams.set(TX_SEARCH_PARAM, txHash);
                //     setSearchParams(searchParams);
                //   },
                // }),
              ),
            }
          : {}),
        defaultValues: formOptionsWithDefaults,
      });

      // if (prevActionTypeRef.current === actionType) {
      //   return;
      // }
      //
      // prevActionTypeRef.current = actionType;
      //
      // form.reset(formOptionsWithDefaults, {
      //   keepDirty: true,
      //   keepDirtyValues: true,
      // });
    },
    [
      defaultValues,
      colony.nativeToken.tokenAddress,
      searchParams,
      setSearchParams,
    ],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};

export default useActionFormProps;
