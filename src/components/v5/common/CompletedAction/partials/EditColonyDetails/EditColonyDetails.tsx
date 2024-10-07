import { PencilCircle, Image, FileText } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import {
  TITLE_FIELD_NAME,
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  COLONY_DESCRIPTION_FIELD_NAME,
  COLONY_AVATAR_FIELD_NAME,
  COLONY_NAME_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/ColonyAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  SocialLinksTable,
  ActionData,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.EditColonyDetails';

interface EditColonyDetailsProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: "Updating the Colony's details",
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Colony details updated by {user}',
  },
});

const EditColonyDetails = ({ action }: EditColonyDetailsProps) => {
  const decisionMethod = useDecisionMethod(action);
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser, transactionHash, annotation } = action;
  const actionColonyMetadata =
    action.pendingColonyMetadata || action.colony.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.EditColonyDetails,
            [COLONY_DESCRIPTION_FIELD_NAME]: actionColonyMetadata?.description,
            [COLONY_AVATAR_FIELD_NAME]: {
              image: actionColonyMetadata?.avatar,
            },
            [COLONY_NAME_FIELD_NAME]: actionColonyMetadata?.displayName,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
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
          rowLabel={formatText({ id: 'actionSidebar.colonyName' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyName',
          })}
          rowContent={actionColonyMetadata?.displayName}
          RowIcon={PencilCircle}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.colonyLogo' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyLogo',
          })}
          rowContent={
            <ColonyAvatar
              colonyImageSrc={actionColonyMetadata?.avatar ?? undefined}
              colonyAddress={action.colonyAddress}
              colonyName={actionColonyMetadata?.displayName}
              size={20}
            />
          }
          RowIcon={Image}
        />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.colonyDescription' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyDescription',
          })}
          rowContent={actionColonyMetadata?.description}
          RowIcon={FileText}
        />

        <DecisionMethodRow action={action} />

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
      {actionColonyMetadata?.externalLinks && (
        <SocialLinksTable socialLinks={actionColonyMetadata.externalLinks} />
      )}
    </>
  );
};

EditColonyDetails.displayName = displayName;
export default EditColonyDetails;
