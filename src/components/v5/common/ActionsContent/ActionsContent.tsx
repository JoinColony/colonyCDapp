import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

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
import DefaultField from './partials/DefaultField';
import TeamColourField from './partials/TeamColourField';
import ColonyVersionField from './partials/ColonyVersionField';
import ColonyDetailsFields from './partials/ColonyDetailsFields';
import { MAX_DOMAIN_PURPOSE_LENGTH } from '~constants';
import ActionTypeSelect from '../ActionSidebar/ActionTypeSelect';
import styles from '../ActionSidebar/ActionSidebar.module.css';
import { ActionSidebarRowFieldNameEnum } from '../ActionSidebarRow/enums';

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
    shouldShowTransferFundsField,
    shouldShowTeamPurposeField,
    shouldShowTeamNameField,
    shouldShowTeamColourField,
    shouldShowVersionFields,
    shouldShowColonyDetailsFields,
    prepareAmountTitle,
    isError,
  } = useActionsContent();
  const [
    isDecriptionFieldExpanded,
    {
      toggle: toggleDecriptionSelect,
      toggleOff: toggleOffDecriptionSelect,
      toggleOn: toggleOnDecriptionSelect,
    },
  ] = useToggle();
  const { formatMessage } = useIntl();

  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffDecriptionSelect(),
  });
  const { field } = useController({
    name: 'title',
  });

  return (
    <>
      <input
        type="text"
        {...field}
        className={styles.titleInput}
        placeholder={formatMessage({ id: 'placeholder.title' })}
      />
      <ActionTypeSelect />
      {shouldShowFromField && (
        <ActionSidebarRow
          iconName="users-three"
          fieldName={ActionSidebarRowFieldNameEnum.FROM}
          title={{ id: 'actionSidebar.from' }}
          isError={isError('team')}
        >
          <TeamsSelect name="team" isError={isError('team')} />
        </ActionSidebarRow>
      )}
      {shouldShowVersionFields && <ColonyVersionField />}
      {shouldShowTransferFundsField && (
        <ActionSidebarRow
          iconName="arrow-down-right"
          fieldName={ActionSidebarRowFieldNameEnum.TO}
          title={{ id: 'actionSidebar.to' }}
          isError={isError('to')}
        >
          <TeamsSelect name="to" isError={isError('to')} />
        </ActionSidebarRow>
      )}
      {shouldShowColonyDetailsFields && <ColonyDetailsFields />}
      {shouldShowUserField && (
        <ActionSidebarRow
          iconName="user-focus"
          fieldName={ActionSidebarRowFieldNameEnum.RECIPIENT}
          title={{ id: 'actionSidebar.recipent' }}
          isError={isError('recipient')}
        >
          <UserSelect name="recipient" isError={isError('recipient')} />
        </ActionSidebarRow>
      )}
      {shouldShowAmountField && (
        <ActionSidebarRow
          iconName="coins"
          fieldName={ActionSidebarRowFieldNameEnum.AMOUNT}
          title={{ id: prepareAmountTitle }}
          isError={isError('amount')}
        >
          <AmountField name="amount" isError={isError('amount')} />
        </ActionSidebarRow>
      )}
      {shouldShowTeamNameField && (
        <ActionSidebarRow
          iconName="user-list"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_NAME}
          title={{ id: 'actionSidebar.teamName' }}
          isError={isError('teamName')}
        >
          <DefaultField
            name="teamName"
            placeholder={{ id: 'actionSidebar.placeholder.teamName' }}
            isError={isError('teamName')}
          />
        </ActionSidebarRow>
      )}
      {shouldShowTeamPurposeField && (
        <ActionSidebarRow
          iconName="rocket"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_PURPOSE}
          title={{ id: 'actionSidebar.teamPurpose' }}
          isError={isError('domainPurpose')}
        >
          <DefaultField
            name="domainPurpose"
            placeholder={{ id: 'actionSidebar.placeholder.purpose' }}
            isError={isError('domainPurpose')}
            maxLength={MAX_DOMAIN_PURPOSE_LENGTH}
          />
        </ActionSidebarRow>
      )}
      {shouldShowTeamColourField && (
        <ActionSidebarRow
          iconName="paint"
          fieldName={ActionSidebarRowFieldNameEnum.TEAM_COLOUR}
          title={{ id: 'actionSidebar.teamColour' }}
          isError={isError('domainColor')}
        >
          <TeamColourField isError={isError('domainColor')} />
        </ActionSidebarRow>
      )}
      {shouldShowCreatedInField && (
        <ActionSidebarRow
          iconName="house-line"
          fieldName={ActionSidebarRowFieldNameEnum.CREATED_IN}
          title={{ id: 'actionSidebar.createdIn' }}
          isError={isError('createdIn')}
        >
          <TeamsSelect name="createdIn" isError={isError('createdIn')} />
        </ActionSidebarRow>
      )}
      {shouldShowDecisionField && selectedAction && (
        <ActionSidebarRow
          iconName="scales"
          fieldName={ActionSidebarRowFieldNameEnum.DECISION_METHOD}
          title={{ id: 'actionSidebar.decisionMethod' }}
          isError={isError('decisionMethod')}
        >
          <DecisionField isError={isError('decisionMethod')} />
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
          isError={isError('annotation')}
        >
          <DescriptionField
            isDecriptionFieldExpanded={isDecriptionFieldExpanded}
            toggleOffDecriptionSelect={toggleOffDecriptionSelect}
            toggleOnDecriptionSelect={toggleOnDecriptionSelect}
            isError={isError('annotation')}
          />
        </ActionSidebarRow>
      )}
    </>
  );
};

ActionsContent.displayName = displayName;

export default ActionsContent;
