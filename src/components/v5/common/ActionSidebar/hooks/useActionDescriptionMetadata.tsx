import { useApolloClient } from '@apollo/client';
import merge from 'lodash/merge';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { getActionTitleValues } from '~common/ColonyActions';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ADDRESS_ZERO } from '~constants';
import { ACTION, Action } from '~constants/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import AsyncText from '~v5/shared/AsyncText';
import UserPopover from '~v5/shared/UserPopover';

import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { advancedPaymentDescriptionMetadataGetter } from '../partials/forms/AdvancedPaymentForm/utils';
import { createDecisionDescriptionMetadataGetter } from '../partials/forms/CreateDecisionForm/utils';
import { createNewTeamDescriptionMetadataGetter } from '../partials/forms/CreateNewTeamForm/utils';
import { editColonyDetailsDescriptionMetadataGetter } from '../partials/forms/EditColonyDetailsForm/utils';
import { editTeamDescriptionMetadataGetter } from '../partials/forms/EditTeamForm/utils';
import { enterRecoveryModeDescriptionMetadataGetter } from '../partials/forms/EnterRecoveryModeForm/utils';
import { manageColonyObjectivesDescriptionMetadataGetter } from '../partials/forms/ManageColonyObjectivesForm/utils';
import { managePermissionsDescriptionMetadataGetter } from '../partials/forms/ManagePermissionsForm/utils';
import { manageTokensDescriptionMetadataGetter } from '../partials/forms/ManageTokensForm/utils';
import { mintTokenDescriptionMetadataGetter } from '../partials/forms/MintTokenForm/utils';
import { simplePaymentDescriptionMetadataGetter } from '../partials/forms/SimplePaymentForm/utils';
import { splitPaymentDescriptionMetadataGetter } from '../partials/forms/SplitPaymentForm/utils';
import { trasferFundsDescriptionMetadataGetter } from '../partials/forms/TransferFundsForm/utils';
import { unlockTokenDescriptionMetadataGetter } from '../partials/forms/UnlockTokenForm/utils';
import { upgradeColonyDescriptionMetadataGetter } from '../partials/forms/UpgradeColonyForm/utils';
import { DescriptionMetadataGetter } from '../types';

const DESC_METADATA: Partial<Record<Action, DescriptionMetadataGetter>> = {
  [ACTION.SIMPLE_PAYMENT]: simplePaymentDescriptionMetadataGetter,
  [ACTION.ADVANCED_PAYMENT]: advancedPaymentDescriptionMetadataGetter,
  [ACTION.SPLIT_PAYMENT]: splitPaymentDescriptionMetadataGetter,
  [ACTION.TRANSFER_FUNDS]: trasferFundsDescriptionMetadataGetter,
  [ACTION.MINT_TOKENS]: mintTokenDescriptionMetadataGetter,
  [ACTION.UNLOCK_TOKEN]: unlockTokenDescriptionMetadataGetter,
  [ACTION.MANAGE_TOKENS]: manageTokensDescriptionMetadataGetter,
  [ACTION.EDIT_COLONY_DETAILS]: editColonyDetailsDescriptionMetadataGetter,
  [ACTION.CREATE_NEW_TEAM]: createNewTeamDescriptionMetadataGetter,
  [ACTION.EDIT_EXISTING_TEAM]: editTeamDescriptionMetadataGetter,
  [ACTION.UPGRADE_COLONY_VERSION]: upgradeColonyDescriptionMetadataGetter,
  [ACTION.ENTER_RECOVERY_MODE]: enterRecoveryModeDescriptionMetadataGetter,
  [ACTION.CREATE_DECISION]: createDecisionDescriptionMetadataGetter,
  [ACTION.MANAGE_PERMISSIONS]: managePermissionsDescriptionMetadataGetter,
  [ACTION.MANAGE_COLONY_OBJECTIVES]:
    manageColonyObjectivesDescriptionMetadataGetter,
};

export const useActionDescriptionMetadata = (actionData?: ColonyAction) => {
  const formValues = useFormContext().getValues();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const apolloClient = useApolloClient();
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  return useMemo(() => {
    if (!selectedAction || !colony || !user) {
      return undefined;
    }

    const commonActionData: Omit<ColonyAction, 'type'> = {
      initiatorAddress: user.walletAddress,
      initiatorUser: user,
      blockNumber: 0,
      createdAt: new Date().toISOString(),
      colony: {
        ...colony,
        nativeToken: {
          ...colony.nativeToken,
          nativeTokenDecimals: colony.nativeToken.decimals,
          nativeTokenSymbol: colony.nativeToken.symbol,
          tokenAddress: colony.nativeToken.tokenAddress,
        },
      },
      colonyAddress: colony.colonyAddress,
      showInActionsList: true,
      transactionHash: ADDRESS_ZERO,
    };

    return (
      <AsyncText
        text={async () => {
          const actionTitleValues = actionData
            ? getActionTitleValues(actionData, colony)
            : await DESC_METADATA[selectedAction]?.(formValues, {
                client: apolloClient,
                colony,
                getActionTitleValues: (
                  action,
                  keyFallbackValues,
                  actionTypeOverride,
                ) =>
                  getActionTitleValues(
                    merge({}, commonActionData, action),
                    colony,
                    keyFallbackValues,
                    // @TODO a temporary hack until we fix this properly via https://github.com/JoinColony/colonyCDapp/issues/1669
                    actionTypeOverride,
                  ),
              });

          if (!actionTitleValues) {
            return undefined;
          }

          if (!(ActionTitleMessageKeys.Initiator in actionTitleValues)) {
            return formatText({ id: 'action.title' }, actionTitleValues);
          }

          const initiator = actionTitleValues[ActionTitleMessageKeys.Initiator];

          return formatText(
            { id: 'action.title' },
            {
              ...actionTitleValues,
              [ActionTitleMessageKeys.Initiator]: (
                <UserPopover
                  userName={user.profile?.displayName}
                  walletAddress={user.walletAddress}
                  aboutDescription={user.profile?.bio || ''}
                  user={user}
                  wrapperClassName="!inline-flex"
                >
                  <span className="text-gray-900">
                    {React.isValidElement(initiator) ? initiator : null}
                  </span>
                </UserPopover>
              ),
            },
          );
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(formValues),
    selectedAction,
    apolloClient,
    colony,
  ]);
};
