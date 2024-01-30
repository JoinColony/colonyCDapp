import { Browser, Browsers } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
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

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          newVersion: newColonyVersion,
          user: initiatorUser ? (
            <UserPopover
              userName={initiatorUser.profile?.displayName}
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        {action.newColonyVersion && (
          <>
            <div>
              <Tooltip
                placement={DEFAULT_TOOLTIP_POSITION}
                tooltipContent={formatText({
                  id: 'actionSidebar.tooltip.upgradeColonyVersion.currentVersion',
                })}
              >
                <div className="flex items-center gap-2">
                  <Browser size={ICON_SIZE} />
                  <span>
                    {formatText({ id: 'actionSidebar.currentVersion' })}
                  </span>
                </div>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              {action.newColonyVersion - 1}
            </div>

            <div>
              <Tooltip
                placement={DEFAULT_TOOLTIP_POSITION}
                tooltipContent={formatText({
                  id: 'actionSidebar.tooltip.upgradeColonyVersion.newVersion',
                })}
              >
                <div className="flex items-center gap-2">
                  <Browsers size={ICON_SIZE} />
                  <span>{formatText({ id: 'actionSidebar.newVersion' })}</span>
                </div>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              {action.newColonyVersion}
            </div>
          </>
        )}

        <DecisionMethodRow isMotion={action.isMotion || false} />

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

UpgradeColonyVersion.displayName = displayName;
export default UpgradeColonyVersion;
