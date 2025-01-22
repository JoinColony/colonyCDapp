import { Link, PlusMinus } from '@phosphor-icons/react';
import { type FC } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { findSupportedChain } from '~utils/proxyColonies.ts';
import {
  TITLE_FIELD_NAME,
  ACTION_TYPE_FIELD_NAME,
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import ChainBadge from '~v5/common/Pills/ChainBadge/ChainBadge.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import ActionData from '../rows/ActionData.tsx';
import ActionTypeRow from '../rows/ActionType.tsx';
import DecisionMethodRow from '../rows/DecisionMethod.tsx';
import DescriptionRow from '../rows/Description.tsx';

const displayName = 'v5.common.CompletedAction.partials.ManageSupportedChain';

interface ManageSupportedChainProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  unknownChain: {
    id: `${displayName}.unknownChain`,
    defaultMessage: 'Unknown',
  },
});

const ManageSupportedChain: FC<ManageSupportedChainProps> = ({ action }) => {
  const {
    initiatorUser,
    initiatorAddress,
    annotation,
    transactionHash,
    metadata,
    targetChainId,
  } = action;
  const decisionMethod = useDecisionMethod(action);
  const chainInfo = findSupportedChain(targetChainId);
  const isAddOperation = action.type.startsWith(
    ColonyActionType.AddProxyColony,
  );

  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: action.type,
      },
    ),
  } = metadata || {};

  const subTitle = formatText(
    {
      id: 'action.title',
    },
    {
      actionType: action.type,
      chain: chainInfo?.shortName,
      initiator:
        initiatorUser || initiatorAddress ? (
          <UserInfoPopover
            walletAddress={initiatorUser?.walletAddress || initiatorAddress}
            user={initiatorUser}
            withVerifiedBadge={false}
          >
            {initiatorUser?.profile?.displayName || initiatorAddress}
          </UserInfoPopover>
        ) : null,
    },
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: metadata?.customTitle || '',
            [ACTION_TYPE_FIELD_NAME]: Action.ManageSupportedChains,
            [MANAGE_SUPPORTED_CHAINS_FIELD_NAME]: isAddOperation
              ? ManageEntityOperation.Add
              : ManageEntityOperation.Remove,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message || '',
          }}
        />
      </div>
      <ActionSubtitle>{subTitle}</ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.manageSupportedChains' })}
          rowContent={formatText({
            id: `actionSidebar.option.${isAddOperation ? 'addSupportedChain' : 'removeSupportedChain'}`,
          })}
          RowIcon={PlusMinus}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.chain' })}
          rowContent={
            <ChainBadge
              text={chainInfo?.name || formatText(MSG.unknownChain)}
              icon={chainInfo?.icon}
            />
          }
          RowIcon={Link}
        />
        <DecisionMethodRow action={action} />
      </ActionDataGrid>
      {annotation?.message && (
        <DescriptionRow description={annotation.message} />
      )}
    </>
  );
};

ManageSupportedChain.displayName = displayName;
export default ManageSupportedChain;
