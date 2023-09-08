import React, { FC } from 'react';
import { useController } from 'react-hook-form';
import { useIntl } from 'react-intl';

import ActionSidebarRow from '../ActionSidebarRow';
import TeamsSelect from './partials/TeamsSelect';
import UserSelect from './partials/UserSelect';
import { useActionsContent } from './hooks';
import AmountField from './partials/AmountField';
import { FormCardSelect } from '../Fields/CardSelect';
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
import { ActionSidebarRowFieldNameEnum } from '../ActionSidebarRow/enums';
import { Actions } from '~constants/actions';
import { DECISION_METHOD_OPTIONS } from './consts';

const displayName = 'v5.common.ActionsContent';

const ActionsContent: FC = () => {
  const { selectedAction } = useActionSidebarContext();
  const {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowTransferFundsField,
    shouldShowTeamPurposeField,
    shouldShowTeamNameField,
    shouldShowTeamColourField,
    shouldShowVersionFields,
    shouldShowColonyDetailsFields,
    prepareAmountTitle,
    teamName,
    teamPurpose,
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

  const prepareTeamTitle =
    (selectedAction === Actions.EDIT_EXISTING_TEAM && 'actionSidebar.team') ||
    'actionSidebar.from';

  return (
    <>
      <input
        type="text"
        {...field}
        className={`
          heading-3
          placeholder:text-gray-500
          hover:text-blue-400
          hover:placeholder:text-blue-400
          text-gray-900
          transition-colors
          duration-normal
          mb-7
        `}
        placeholder={formatMessage({ id: 'placeholder.title' })}
      />
      <ActionTypeSelect />
      {shouldShowFromField && (
        <ActionSidebarRow
          iconName="users-three"
          fieldName={ActionSidebarRowFieldNameEnum.FROM}
          title={{ id: prepareTeamTitle }}
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
            defaultValue={teamName}
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
            defaultValue={teamPurpose}
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
      {selectedAction && (
        <ActionSidebarRow
          iconName="house-line"
          fieldName={ActionSidebarRowFieldNameEnum.CREATED_IN}
          title={{ id: 'actionSidebar.createdIn' }}
          isError={isError('createdIn')}
        >
          <TeamsSelect name="createdIn" isError={isError('createdIn')} />
        </ActionSidebarRow>
      )}
      {selectedAction && (
        <ActionSidebarRow
          iconName="scales"
          fieldName={ActionSidebarRowFieldNameEnum.DECISION_METHOD}
          title={{ id: 'actionSidebar.decisionMethod' }}
          isError={isError('decisionMethod')}
        >
          <FormCardSelect
            name="decisionMethod"
            options={DECISION_METHOD_OPTIONS}
            title={formatMessage({ id: 'actionSidebar.availableDecisions' })}
          />
        </ActionSidebarRow>
      )}
      {selectedAction && (
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
