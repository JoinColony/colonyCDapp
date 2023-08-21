import React, { FC } from 'react';

import ActionSidebarRow from '../ActionSidebarRow';
import TeamsSelect from './partials/TeamsSelect';
import UserSelect from './partials/UserSelect';
import { useActionsContent } from './hooks';
import AmountField from './partials/AmountField';
import DecisionField from './partials/DecisionField';
import TransactionTable from './partials/TransactionTable/TransactionTable';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import DescriptionField from './partials/DescriptionField';
import useToggle from '~hooks/useToggle';
import { useDetectClickOutside } from '~hooks';
import { Actions } from '~constants/actions';

const displayName = 'v5.common.ActionsContent';

const ActionsContent: FC = () => {
  const { selectedAction } = useActionSidebarContext();
  const {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
    shouldShowDecisionField,
    shouldShowDescriptionField,
    shouldShowToField,
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
          title={{ id: 'actionSidebar.from' }}
        >
          <TeamsSelect name="team" />
        </ActionSidebarRow>
      )}
      {shouldShowToField && (
        <ActionSidebarRow
          iconName="arrow-down-right"
          title={{ id: 'actionSidebar.to' }}
        >
          <TeamsSelect name="to" />
        </ActionSidebarRow>
      )}
      {shouldShowUserField && (
        <ActionSidebarRow
          iconName="user-focus"
          title={{ id: 'actionSidebar.recipent' }}
        >
          <UserSelect name="recipient" />
        </ActionSidebarRow>
      )}
      {shouldShowAmountField && (
        <ActionSidebarRow iconName="coins" title={{ id: prepareAmountTitle }}>
          <AmountField name="amount" />
        </ActionSidebarRow>
      )}
      {shouldShowDecisionField && selectedAction && (
        <ActionSidebarRow
          iconName="scales"
          title={{ id: 'actionSidebar.decisionMethod' }}
        >
          <DecisionField />
        </ActionSidebarRow>
      )}
      {shouldShowCreatedInField && (
        <ActionSidebarRow
          iconName="house-line"
          title={{ id: 'actionSidebar.createdIn' }}
        >
          <TeamsSelect name="createdIn" />
        </ActionSidebarRow>
      )}
      {shouldShowDescriptionField && (
        <ActionSidebarRow
          iconName="pencil"
          title={{ id: 'actionSidebar.description' }}
          isDescriptionFieldRow
          isOpened={isDecriptionFieldExpanded}
          onToggle={toggleDecriptionSelect}
          ref={ref}
        >
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
          />
        </ActionSidebarRow>
      )}
      {selectedAction === Actions.SIMPLE_PAYMENT && <TransactionTable />}
    </>
  );
};

ActionsContent.displayName = displayName;

export default ActionsContent;
