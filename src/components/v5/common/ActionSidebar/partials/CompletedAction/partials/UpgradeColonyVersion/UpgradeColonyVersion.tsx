import { Browser, Browsers } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ActionData } from '~actions/index.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionContent,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.UpgradeColonyVersion';

interface UpgradeColonyVersionProps {
  actionData: ActionData;
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

const UpgradeColonyVersion = ({ actionData }: UpgradeColonyVersionProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } =
    actionData?.metadata || {};
  const { initiatorUser, newColonyVersion } = actionData;

  const motionDomainMetadata =
    actionData.motionData?.motionDomain.metadata ??
    actionData.multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={actionData.transactionHash}
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
        <ActionTypeRow actionType={actionData.type} />

        {actionData.newColonyVersion && (
          <>
            <ActionContent
              tooltipContent={formatText({
                id: 'actionSidebar.tooltip.upgradeColonyVersion.currentVersion',
              })}
              rowLabel={formatText({ id: 'actionSidebar.currentVersion' })}
              rowContent={actionData.newColonyVersion - 1}
              RowIcon={Browser}
            />
            <ActionContent
              tooltipContent={formatText({
                id: 'actionSidebar.tooltip.upgradeColonyVersion.newVersion',
              })}
              rowLabel={formatText({ id: 'actionSidebar.newVersion' })}
              rowContent={actionData.newColonyVersion}
              RowIcon={Browsers}
            />
          </>
        )}

        <DecisionMethodRow
          isMotion={actionData.isMotion || false}
          isMultisig={actionData.isMultiSig || false}
        />

        {motionDomainMetadata && (
          <CreatedInRow motionDomainMetadata={motionDomainMetadata} />
        )}
      </ActionDataGrid>
      {actionData.annotation?.message && (
        <DescriptionRow description={actionData.annotation.message} />
      )}
    </>
  );
};

UpgradeColonyVersion.displayName = displayName;
export default UpgradeColonyVersion;
