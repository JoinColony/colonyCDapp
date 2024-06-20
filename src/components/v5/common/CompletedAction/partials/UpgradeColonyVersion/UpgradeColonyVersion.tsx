import { Browser, Browsers } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.UpgradeColonyVersion';

interface UpgradeColonyVersionProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Updating the Colony version',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Upgrade Colony version to v{newVersion} by {user}',
  },
});

const UpgradeColonyVersion = ({ action }: UpgradeColonyVersionProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, newColonyVersion } = action;

  const motionDomainMetadata =
    action.motionData?.motionDomain.metadata ??
    action.multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={action.transactionHash}
        />
      </div>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          newVersion: newColonyVersion,
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

        {action.newColonyVersion && (
          <>
            <ActionData
              tooltipContent={formatText({
                id: 'actionSidebar.tooltip.upgradeColonyVersion.currentVersion',
              })}
              rowLabel={formatText({ id: 'actionSidebar.currentVersion' })}
              rowContent={action.newColonyVersion - 1}
              RowIcon={Browser}
            />
            <ActionData
              tooltipContent={formatText({
                id: 'actionSidebar.tooltip.upgradeColonyVersion.newVersion',
              })}
              rowLabel={formatText({ id: 'actionSidebar.newVersion' })}
              rowContent={action.newColonyVersion}
              RowIcon={Browsers}
            />
          </>
        )}

        <DecisionMethodRow action={action} />

        {motionDomainMetadata && (
          <CreatedInRow motionDomainMetadata={motionDomainMetadata} />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

UpgradeColonyVersion.displayName = displayName;
export default UpgradeColonyVersion;
