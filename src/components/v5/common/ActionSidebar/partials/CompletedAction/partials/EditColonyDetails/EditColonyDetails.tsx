import { PencilCircle, Image, FileText } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ActionData, CoreAction } from '~actions/index.ts';
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
import { useDecisionMethod } from '~v5/common/ActionSidebar/partials/CompletedAction/hooks.ts';
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
  ActionContent,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.EditColonyDetails';

interface EditColonyDetailsProps {
  actionData: ActionData;
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

const EditColonyDetails = ({ actionData }: EditColonyDetailsProps) => {
  const decisionMethod = useDecisionMethod(actionData);
  const { customTitle = formatText(MSG.defaultTitle) } =
    actionData?.metadata || {};
  const { initiatorUser, transactionHash, annotation } = actionData;
  const actionColonyMetadata =
    actionData.pendingColonyMetadata || actionData.colony.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: CoreAction.ColonyEdit,
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
        <ActionTypeRow actionType={actionData.type} />
        <ActionContent
          rowLabel={formatText({ id: 'actionSidebar.colonyName' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyName',
          })}
          rowContent={actionColonyMetadata?.displayName}
          RowIcon={PencilCircle}
        />
        <ActionContent
          rowLabel={formatText({ id: 'actionSidebar.colonyLogo' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyLogo',
          })}
          rowContent={
            <ColonyAvatar
              colonyImageSrc={actionColonyMetadata?.avatar ?? undefined}
              colonyAddress={actionData.colonyAddress}
              colonyName={actionColonyMetadata?.displayName}
              size={20}
            />
          }
          RowIcon={Image}
        />
        <ActionContent
          rowLabel={formatText({ id: 'actionSidebar.colonyDescription' })}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.editColony.colonyDescription',
          })}
          rowContent={actionColonyMetadata?.description}
          RowIcon={FileText}
        />

        <DecisionMethodRow
          isMotion={actionData.isMotion || false}
          isMultisig={actionData.isMultiSig || false}
        />

        {actionData.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={actionData.motionData.motionDomain.metadata}
          />
        )}
        {/* @TODO implement social links table display */}
      </ActionDataGrid>
      {actionData.annotation?.message && (
        <DescriptionRow description={actionData.annotation.message} />
      )}
      {actionColonyMetadata?.externalLinks && (
        <SocialLinksTable socialLinks={actionColonyMetadata.externalLinks} />
      )}
    </>
  );
};

EditColonyDetails.displayName = displayName;
export default EditColonyDetails;
