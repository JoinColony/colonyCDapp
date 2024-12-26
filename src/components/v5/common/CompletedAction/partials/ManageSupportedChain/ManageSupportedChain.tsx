import { Link, PlusMinus } from '@phosphor-icons/react';
import { type FC } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import ChainBadge from '~v5/common/Pills/ChainBadge/ChainBadge.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
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
  const { initiatorUser, annotation, multiChainInfo } = action;
  const chainInfo = SUPPORTED_CHAINS.find(
    (supportedChain) =>
      supportedChain.chainId === multiChainInfo?.targetChainId,
  );
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
  } = action?.metadata || {};
  const subTitle = formatText(
    {
      id: 'action.title',
    },
    {
      actionType: action.type,
      chain: chainInfo?.name,
      initiator: initiatorUser ? (
        <UserInfoPopover
          walletAddress={initiatorUser.walletAddress}
          user={initiatorUser}
          withVerifiedBadge={false}
        >
          {initiatorUser.profile?.displayName}
        </UserInfoPopover>
      ) : null,
    },
  );

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
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
