import { Article, FileText, Percent } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { ICON_SIZE } from '../../consts.ts';
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

const displayName = 'v5.common.CompletedAction.partials.EditColonyDetails';

interface Props {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: "Updating the Colony's objective",
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Manage Colony Objective by {user}',
  },
  colonyTitle: {
    id: `${displayName}.colonyTitle`,
    defaultMessage: 'Objective title',
  },
  colonyDescription: {
    id: `${displayName}.colonyDescription`,
    defaultMessage: 'Objective description',
  },
  colonyProgress: {
    id: `${displayName}.colonyProgress`,
    defaultMessage: 'Progress percentage',
  },
});

const EditColonyDetails = ({ action }: Props) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
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
        <div className="flex items-center gap-2">
          <Article size={ICON_SIZE} />
          <span>{formatText(MSG.colonyTitle)}</span>
        </div>
        <div>
          <span>{action.colony.metadata?.objective?.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={ICON_SIZE} />
          <span>{formatText(MSG.colonyDescription)}</span>
        </div>
        <div>
          <span>{action.colony.metadata?.objective?.description}</span>
        </div>

        <div className="flex items-center gap-2">
          <Percent size={ICON_SIZE} />
          <span>{formatText(MSG.colonyProgress)}</span>
        </div>
        <div>
          <span>{action.colony.metadata?.objective?.progress}</span>
        </div>
        <DecisionMethodRow isMotion={action.isMotion || false} />
        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
        {/* @TODO implement social links table display */}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

EditColonyDetails.displayName = displayName;

export default EditColonyDetails;
