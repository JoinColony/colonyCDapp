import React, { FC } from 'react';

import ActionSidebarRow from '../ActionSidebarRow';
import TeamsSelect from './partials/TeamsSelect';
import UserSelect from './partials/UserSelect';
import { useActionsContent } from './hooks';
import AmountField from './partials/AmountField';
import DecisionField from './partials/DecisionField';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import DescriptionField from './partials/DescriptionField';
import useToggle from '~hooks/useToggle';
import { useDetectClickOutside } from '~hooks';
import { Actions } from '~constants/actions';
import DefaultField from './partials/DefaultField';
import TeamColourField from './partials/TeamColourField';
import ColonyVersionField from './partials/ColonyVersionField';
import { ActionsContentProps } from './types';
import { ActionSidebarRowFieldNameEnum } from '../ActionSidebarRow/enums';

const displayName = 'v5.common.ActionsContent';

const ActionsContent: FC<ActionsContentProps> = ({ formErrors }) => {
  const { selectedAction } = useActionSidebarContext();
  const {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
    shouldShowDecisionField,
    shouldShowDescriptionField,
    shouldShowTransferFundsField,
    shouldShowTeamPurposeField,
    shouldShowTeamNameField,
    shouldShowTeamColourField,
    shouldShowVersionFields,
  } = useActionsContent();
  const [
    isDecriptionFieldExpanded,
    {
      toggle: toggleDecriptionSelect,
      toggleOff: toggleOffDecriptionSelect,
      toggleOn: toggleOnDecriptionSelect,
    },
  ] = useToggle();

  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffDecriptionSelect(),
  });

  const prepareAmountTitle =
    (selectedAction === Actions.SIMPLE_PAYMENT && 'actionSidebar.amount') ||
    'actionSidebar.value';

  return (
    <>
      {shouldShowFromField && (
        <ActionSidebarRow
          iconName="users-three"
          fieldName={ActionSidebarRowFieldNameEnum.FROM}
          title={{ id: 'actionSidebar.from' }}
          isErrors={formErrors?.team}
        >
          <TeamsSelect name="team" isErrors={formErrors?.team} />
        </ActionSidebarRow>
      )}
      {shouldShowVersionFields && <ColonyVersionField />}
      {shouldShowTransferFundsField && (
        <ActionSidebarRow
          iconName="arrow-down-right"
          fieldName={ActionSidebarRowFieldNameEnum.TO}
          title={{ id: 'actionSidebar.to' }}
          isErrors={formErrors?.to}
        >
          <TeamsSelect name="to" isErrors={formErrors?.to} />
        </ActionSidebarRow>
      )}
      {shouldShowUserField && (
        <ActionSidebarRow
          iconName="user-focus"
          fieldName={ActionSidebarRowFieldNameEnum.RECIPIENT}
          title={{ id: 'actionSidebar.recipent' }}
          isErrors={formErrors?.recipient}
        >
          <UserSelect name="recipient" isErrors={formErrors?.recipient} />
        </ActionSidebarRow>
      )}
      {shouldShowAmountField && (
        <ActionSidebarRow
          iconName="coins"
          fieldName={ActionSidebarRowFieldNameEnum.AMOUNT}
          title={{ id: prepareAmountTitle }}
          isErrors={formErrors?.amount}
        >
          <AmountField name="amount" isErrors={formErrors?.amount} />
        </ActionSidebarRow>
      )}
      {shouldShowTeamNameField && (
        <ActionSidebarRow
          iconName="user-list"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_NAME}
          title={{ id: 'actionSidebar.teamName' }}
          isErrors={formErrors?.teamName}
        >
          <DefaultField
            name="teamName"
            placeholder={{ id: 'actionSidebar.placeholder.teamName' }}
            isErrors={formErrors?.teamName}
          />
        </ActionSidebarRow>
      )}
      {shouldShowTeamPurposeField && (
        <ActionSidebarRow
          iconName="rocket"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_PURPOSE}
          title={{ id: 'actionSidebar.teamPurpose' }}
          isErrors={formErrors?.domainPurpose}
        >
          <DefaultField
            name="domainPurpose"
            placeholder={{ id: 'actionSidebar.placeholder.purpose' }}
            isErrors={formErrors?.domainPurpose}
          />
        </ActionSidebarRow>
      )}
      {shouldShowTeamColourField && (
        <ActionSidebarRow
          iconName="paint"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_COLOUR}
          title={{ id: 'actionSidebar.teamColour' }}
          isErrors={formErrors?.domainColor}
        >
          <TeamColourField isErrors={formErrors?.domainColor} />
        </ActionSidebarRow>
      )}
      {shouldShowCreatedInField && (
        <ActionSidebarRow
          iconName="house-line"
          fieldName={ActionSidebarRowFieldNameEnum.CREATED_IN}
          title={{ id: 'actionSidebar.createdIn' }}
          isErrors={formErrors?.createdIn}
        >
          <TeamsSelect name="createdIn" isErrors={formErrors?.createdIn} />
        </ActionSidebarRow>
      )}
      {shouldShowDecisionField && selectedAction && (
        <ActionSidebarRow
          iconName="scales"
          fieldName={ActionSidebarRowFieldNameEnum.DECISION_METHOD}
          title={{ id: 'actionSidebar.decisionMethod' }}
          isErrors={formErrors?.decisionMethod}
        >
          <DecisionField isErrors={formErrors?.decisionMethod} />
        </ActionSidebarRow>
      )}
      {shouldShowDescriptionField && (
        <ActionSidebarRow
          iconName="pencil"
          fieldName={ActionSidebarRowFieldNameEnum.DESCRIPTION}
          title={{ id: 'actionSidebar.description' }}
          isDescriptionFieldRow
          isOpened={isDecriptionFieldExpanded}
          onToggle={toggleDecriptionSelect}
          ref={ref}
          isErrors={formErrors?.annotation}
        >
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            isErrors={formErrors?.annotation}
          />
        </ActionSidebarRow>
      )}
    </>
  );
};

ActionsContent.displayName = displayName;

export default ActionsContent;
