import { Id } from '@colony/sdk';
import { useCallback, useMemo } from 'react';
import { type DeepPartial } from 'redux';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions.ts';
import {
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { useCheckOperationType } from '~v5/common/ActionSidebar/hooks/useCheckOperationType.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  type ManageSupportedChainsFormValues,
  validationSchema,
} from './consts.ts';
import { getManageSupportedChainsPayload } from './utils.ts';

export const useManageSupportedChainsForm = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();

  const isRemoveOperation = useCheckOperationType(
    MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
    ManageEntityOperation.Remove,
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: isRemoveOperation
      ? ActionTypes.PROXY_COLONY_REMOVE
      : ActionTypes.PROXY_COLONY_CREATE,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      mapPayload((values: ManageSupportedChainsFormValues) =>
        getManageSupportedChainsPayload(colony, values),
      ),
      [],
    ),
    defaultValues: useMemo<DeepPartial<ManageSupportedChainsFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        chain: '',
      }),
      [],
    ),
  });
};
