import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import ActionSidebarRow from '../ActionSidebarRow';
import TeamsSelect from './partials/TeamsSelect';
import TeamBadge from '../Pills/TeamBadge';
import UserSelect from './partials/UserSelect';
import styles from './ActionsContent.module.css';
import UserAvatar from '~v5/shared/UserAvatar';
import { useActionsContent } from './hooks';

const displayName = 'v5.common.ActionsContent';

const ActionsContent: FC = () => {
  const { formatMessage } = useIntl();
  const {
    isTeamSelectVisible,
    isUserSelectVisible,
    selectedTeam,
    selectedUser,
    setSelectedTeam,
    setSelectedUser,
    toggleTeamSelect,
    toggleUserSelect,
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    userDisplayName,
    username,
    user,
  } = useActionsContent();

  return (
    <>
      {shouldShowFromField && (
        <ActionSidebarRow
          iconName="users-three"
          title={{ id: 'actionSidebar.from' }}
        >
          {selectedTeam ? (
            <TeamBadge teamName={selectedTeam} text={selectedTeam} />
          ) : (
            <>
              <button
                type="button"
                className={styles.button}
                onClick={toggleTeamSelect}
              >
                {formatMessage({ id: 'actionSidebar.selectTeam' })}
              </button>
              <TeamsSelect
                isOpen={isTeamSelectVisible}
                onToggle={toggleTeamSelect}
                onSelect={setSelectedTeam}
              />
            </>
          )}
        </ActionSidebarRow>
      )}
      {shouldShowUserField && (
        <ActionSidebarRow
          iconName="user-focus"
          title={{ id: 'actionSidebar.recipent' }}
        >
          {selectedUser ? (
            <UserAvatar
              user={user}
              userName={userDisplayName || username}
              size="xs"
            />
          ) : (
            <>
              <button
                type="button"
                className={styles.button}
                onClick={toggleUserSelect}
              >
                {formatMessage({ id: 'actionSidebar.selectMember' })}
              </button>
              <UserSelect
                isOpen={isUserSelectVisible}
                onToggle={toggleUserSelect}
                onSelect={setSelectedUser}
              />
            </>
          )}
        </ActionSidebarRow>
      )}
      {shouldShowAmountField && (
        <ActionSidebarRow
          iconName="coins"
          title={{ id: 'actionSidebar.amount' }}
        >
          asd
        </ActionSidebarRow>
      )}
    </>
  );
};

ActionsContent.displayName = displayName;

export default ActionsContent;
