import { Article, FileText, Percent } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { CoreActionGroup, type ActionData } from '~actions';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { formatText } from '~utils/intl.ts';
import {
  TITLE_FIELD_NAME,
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  COLONY_OBJECTIVE_TITLE_FIELD_NAME,
  COLONY_OBJECTIVE_DESCRIPTION_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { ICON_SIZE } from '~v5/common/ActionSidebar/partials/CompletedAction/consts.ts';
import { useDecisionMethod } from '~v5/common/ActionSidebar/partials/CompletedAction/hooks.ts';
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
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.UpgradeColonyObjective';

interface Props {
  actionData: ActionData;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: "Updating the Colony's objective",
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Manage objective by {user}',
  },
  objectiveTitle: {
    id: `${displayName}.objectiveTitle`,
    defaultMessage: 'Objective title',
  },
  objectiveDescription: {
    id: `${displayName}.objectiveDescription`,
    defaultMessage: 'Objective description',
  },
  objectiveProgress: {
    id: `${displayName}.objectiveProgress`,
    defaultMessage: 'Progress percentage',
  },
});

/**
 * @deprecated
 * This is still needed to allow users to view existing Colony Objectives in the Completed Action component
 */
const UpgradeColonyObjective = ({ actionData: action }: Props) => {
  const decisionMethod = useDecisionMethod(action);
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    transactionHash,
    initiatorUser,
    colony,
    isMotion,
    isMultiSig,
    pendingColonyMetadata,
    annotation,
  } = action;

  const objectiveData =
    isMotion || isMultiSig
      ? pendingColonyMetadata?.objective
      : colony.metadata?.objective;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: CoreActionGroup.UpdateColonyObjective,
            [COLONY_OBJECTIVE_TITLE_FIELD_NAME]: objectiveData?.title,
            [COLONY_OBJECTIVE_DESCRIPTION_FIELD_NAME]:
              objectiveData?.description,
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
        <ActionTypeRow
          actionType={getExtendedActionType(action, colony.metadata)}
        />
        <div className="flex items-center gap-2">
          <Article size={ICON_SIZE} />
          <span>{formatText(MSG.objectiveTitle)}</span>
        </div>
        <div>
          <span>{objectiveData?.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={ICON_SIZE} />
          <span>{formatText(MSG.objectiveDescription)}</span>
        </div>
        <div>
          <span>{objectiveData?.description}</span>
        </div>

        <div className="flex items-center gap-2">
          <Percent size={ICON_SIZE} />
          <span>{formatText(MSG.objectiveProgress)}</span>
        </div>
        <div>
          <span>{objectiveData?.progress}%</span>
        </div>
        <DecisionMethodRow
          isMotion={action.isMotion || false}
          isMultisig={action.isMultiSig || false}
        />
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

UpgradeColonyObjective.displayName = displayName;

export default UpgradeColonyObjective;
