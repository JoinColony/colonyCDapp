import { useApolloClient } from '@apollo/client';
import merge from 'lodash/merge';
import React from 'react';
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

import { ACTION_TYPE_FIELD_NAME } from '../../consts';
import { DescriptionMetadataGetter } from '../../types';
import { advancedPaymentDescriptionMetadataGetter } from '../forms/AdvancedPaymentForm/utils';
import { createDecisionDescriptionMetadataGetter } from '../forms/CreateDecisionForm/utils';
import { createNewTeamDescriptionMetadataGetter } from '../forms/CreateNewTeamForm/utils';
import { editColonyDetailsDescriptionMetadataGetter } from '../forms/EditColonyDetailsForm/utils';
import { editTeamDescriptionMetadataGetter } from '../forms/EditTeamForm/utils';
import { enterRecoveryModeDescriptionMetadataGetter } from '../forms/EnterRecoveryModeForm/utils';
import { manageColonyObjectivesDescriptionMetadataGetter } from '../forms/ManageColonyObjectivesForm/utils';
import { managePermissionsDescriptionMetadataGetter } from '../forms/ManagePermissionsForm/utils';
import { manageTokensDescriptionMetadataGetter } from '../forms/ManageTokensForm/utils';
import { mintTokenDescriptionMetadataGetter } from '../forms/MintTokenForm/utils';
import { simplePaymentDescriptionMetadataGetter } from '../forms/SimplePaymentForm/utils';
import { splitPaymentDescriptionMetadataGetter } from '../forms/SplitPaymentForm/utils';
import { trasferFundsDescriptionMetadataGetter } from '../forms/TransferFundsForm/utils';
import { unlockTokenDescriptionMetadataGetter } from '../forms/UnlockTokenForm/utils';
import { upgradeColonyDescriptionMetadataGetter } from '../forms/UpgradeColonyForm/utils';

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

const displayName =
  'v5.common.ActionsContent.partials.ActionDescriptionMetadata';

const ActionDescriptionMetadata = () => {
  const formValues = useFormContext().getValues();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const apolloClient = useApolloClient();
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  if (!selectedAction || !colony || !user) {
    return null;
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
        const actionTitleValues = await DESC_METADATA[selectedAction]?.(
          formValues,
          {
            client: apolloClient,
            colony,
            getActionTitleValues: (action, keyFallbackValues) => {
              return getActionTitleValues(
                merge({}, commonActionData, action),
                colony,
                keyFallbackValues,
              );
            },
          },
        );

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
};

ActionDescriptionMetadata.displayName = displayName;
export default ActionDescriptionMetadata;
