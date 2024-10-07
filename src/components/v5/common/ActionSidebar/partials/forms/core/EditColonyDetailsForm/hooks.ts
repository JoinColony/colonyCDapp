import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { getEditColonyDetailsValidationSchema } from './consts.ts';
import { type EditColonyDetailsFormValues } from './types.ts';
import { getEditColonyDetailsPayload } from './utils.tsx';

export const useEditColonyDetails = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  const defaultValues = useMemo<DeepPartial<EditColonyDetailsFormValues>>(
    () => ({
      colonyName: metadata?.displayName,
      avatar: {
        image: metadata?.avatar,
        thumbnail: metadata?.thumbnail,
      },
      colonyDescription: metadata?.description || '',
      createdIn: Id.RootDomain,
      externalLinks: metadata?.externalLinks ?? [],
    }),
    [
      metadata?.avatar,
      metadata?.description,
      metadata?.displayName,
      metadata?.externalLinks,
      metadata?.thumbnail,
    ],
  );

  const validationSchema = useMemo(
    () => getEditColonyDetailsValidationSchema(defaultValues),
    [defaultValues],
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EDIT_COLONY
        : ActionTypes.MOTION_EDIT_COLONY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: EditColonyDetailsFormValues) => {
          return getEditColonyDetailsPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
