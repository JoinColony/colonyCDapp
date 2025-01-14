import { Id } from '@colony/sdk';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'redux';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useDeployedChainIds } from '~hooks/proxyColonies/useDeployedChainIds.ts';
import { ActionTypes } from '~redux';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import {
  CHAIN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
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

const useActionType = () => {
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const isRemoveOperation = useCheckOperationType(
    MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
    ManageEntityOperation.Remove,
  );

  const chainId = useWatch({ name: CHAIN_FIELD_NAME });
  const disabledProxyColoniesChainIds = useDeployedChainIds({
    filterFn: (deployedProxyColony) => !deployedProxyColony?.isActive,
  });
  const isChainDisabled = disabledProxyColoniesChainIds.includes(
    chainId?.toString(),
  );

  /**
   * This assumes that we only have Permissions, Reputation & Multi-Sig
   * Update this once we start to support more decision methods
   */
  if (
    (isRemoveOperation || isChainDisabled) &&
    decisionMethod !== DecisionMethod.Permissions
  ) {
    return ActionTypes.MOTION_PROXY_COLONY_ENABLE_DISABLE;
  }

  /**
   * @TODO Consider unifying the permissions saga for enabling & disabling as well
   */
  if (isRemoveOperation) {
    return ActionTypes.PROXY_COLONY_REMOVE;
  }

  if (isChainDisabled) {
    return ActionTypes.PROXY_COLONY_ENABLE;
  }

  if (
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.MultiSig
  ) {
    return ActionTypes.MOTION_PROXY_COLONY_CREATE;
  }

  return ActionTypes.PROXY_COLONY_CREATE;
};

export const useManageSupportedChainsForm = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const actionType = useActionType();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType,
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
