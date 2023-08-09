import React, { FC } from 'react';

import ActionSidebarRow from '../ActionSidebarRow';
import TeamsSelect from './partials/TeamsSelect';
import UserSelect from './partials/UserSelect';
import { useActionsContent } from './hooks';
import AmountField from './partials/AmountField';
import DecisionField from './partials/DecisionField';
import TransactionTable from './partials/TransactionTable/TransactionTable';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

const displayName = 'v5.common.ActionsContent';

const ActionsContent: FC = () => {
  const { selectedAction } = useActionSidebarContext();
  const {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
  } = useActionsContent();

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
      {shouldShowUserField && (
        <ActionSidebarRow
          iconName="user-focus"
          title={{ id: 'actionSidebar.recipent' }}
        >
          <UserSelect name="recipient" />
        </ActionSidebarRow>
      )}
      {shouldShowAmountField && (
        <ActionSidebarRow
          iconName="coins"
          title={{ id: 'actionSidebar.amount' }}
        >
          <AmountField name="amount" />
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
      {selectedAction && (
        <>
          <ActionSidebarRow
            iconName="scales"
            title={{ id: 'actionSidebar.decisionMethod' }}
          >
            <DecisionField />
          </ActionSidebarRow>
          <TransactionTable />
        </>
      )}
    </>
  );
};

ActionsContent.displayName = displayName;

export default ActionsContent;
