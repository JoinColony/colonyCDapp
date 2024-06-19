import { CoinVertical } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MultiSigMeatballMenu from '../MultiSigMeatballMenu/MultiSigMeatballMenu.tsx';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.UnlockToken';

interface UnlockTokenProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Unlocking a native token',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Unlocking tokens by {user}',
  },
});

const UnlockToken = ({ action }: UnlockTokenProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const { name, symbol } = nativeToken;
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    initiatorUser,
    isMultiSig,
    multiSigData,
    transactionHash,
    type: actionType,
  } = action;

  const isOwner = initiatorUser?.walletAddress === user?.walletAddress;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        {isMultiSig && multiSigData && (
          <MultiSigMeatballMenu
            transactionHash={transactionHash}
            multiSigData={multiSigData}
            isOwner={isOwner}
            actionType={actionType}
          />
        )}
      </div>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          user: initiatorUser ? (
            <UserInfoPopover
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserInfoPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.token' })}
          rowContent={`${name} (${symbol})`}
          RowIcon={CoinVertical}
        />

        <DecisionMethodRow
          isMotion={action.isMotion || false}
          isMultisig={action.isMultiSig || false}
        />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

UnlockToken.displayName = displayName;
export default UnlockToken;
