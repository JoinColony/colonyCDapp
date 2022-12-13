import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import UserMention from '~shared/UserMention';
import { ListGroupItem } from '~shared/ListGroup';
import MemberReputation from '~shared/MemberReputation';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';
import IconTooltip from '~shared/IconTooltip';
import UserAvatar from '~shared/UserAvatar';

import { Watcher, Contributor, Colony } from '~types';
import { ENTER } from '~types/index';
import { getMainClasses } from '~utils/css';
import { useMobile } from '~hooks';

import MemberActions from './Actions';

import styles from './MembersListItem.css';

type User = (Watcher | Contributor)['user'];

interface Props {
  extraItemContent?: (user: User) => ReactNode;
  colony: Colony;
  onRowClick?: (user: User) => void;
  showUserInfo: boolean;
  showUserReputation: boolean;
  canAdministerComments?: boolean;
  member: Watcher | Contributor;
}

const MSG = defineMessages({
  whitelistedTooltip: {
    id: 'shared.MembersList.MembersListItem.whitelistedTooltip',
    defaultMessage: `Added to address book`,
  },
});

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = ({
  colony,
  extraItemContent,
  onRowClick,
  showUserInfo,
  showUserReputation,
  member: { user },
  member,
  canAdministerComments,
}: Props) => {
  const {
    profile,
    name,
    walletAddress,
    // banned = false,
    // isWhitelisted = false,
  } = user || {};

  const { reputationAmount, reputationPercentage } = member as Contributor;

  // const isUserBanned = useMemo(
  //   () =>
  //     canAdministerComments !== undefined
  //       ? canAdministerComments && banned
  //       : banned,
  //   [banned, canAdministerComments],
  // );

  const handleRowClick = useCallback(() => {
    if (onRowClick) {
      onRowClick(user);
    }
  }, [onRowClick, user]);
  const handleRowKeydown = useCallback(
    (evt: KeyboardEvent<HTMLDivElement>) => {
      if (onRowClick && evt.key === ENTER) {
        onRowClick(user);
      }
    },
    [onRowClick, user],
  );

  const renderedExtraItemContent = useMemo(
    () => (extraItemContent ? extraItemContent(user) : null),
    [extraItemContent, user],
  );

  const { displayName } = profile || {};

  const nativeToken = {};
  // colony.tokens.find(
  //   (token) => token.address === colony.nativeTokenAddress,
  // );
  const isMobile = useMobile();
  // Temp hardcoded values until the features are implemented
  const isWhitelisted = true;
  const banned = false;

  return (
    <ListGroupItem>
      {/* Disable, as `role` is conditional */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={getMainClasses({}, styles, {
          hasCallbackFn: !!onRowClick,
          hasReputation: showUserReputation,
        })}
        onClick={onRowClick ? handleRowClick : undefined}
        onKeyDown={onRowClick ? handleRowKeydown : undefined}
        role={onRowClick ? 'button' : undefined}
        // Disable, as `tabIndex` is conditional
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={onRowClick ? 0 : undefined}
      >
        <div className={styles.section}>
          <UserAvatar
            size="s"
            colony={colony}
            address={walletAddress || ''}
            user={user}
            showInfo={!onRowClick || showUserInfo}
            notSet={false}
            // banned={isUserBanned}
            popperOptions={isMobile ? { placement: 'bottom' } : undefined}
          />
        </div>
        <div className={styles.usernameSection}>
          {displayName && (
            <span className={styles.displayName} title={displayName}>
              {displayName}
            </span>
          )}
          {name && (
            <span className={styles.username}>
              <UserMention hasLink={false} username={name} />
            </span>
          )}
          <div className={styles.address}>
            <InvisibleCopyableAddress address={walletAddress || ''}>
              <MaskedAddress address={walletAddress || ''} />
            </InvisibleCopyableAddress>
            {isWhitelisted && (
              <IconTooltip
                icon="check-mark"
                tooltipText={MSG.whitelistedTooltip}
                tooltipClassName={styles.whitelistedIconTooltip}
                appearance={{ size: 'medium' }}
                className={styles.whitelistedIcon}
              />
            )}
          </div>
        </div>
        {renderedExtraItemContent && !isMobile && (
          <div>{renderedExtraItemContent}</div>
        )}
        {showUserReputation && (
          <div className={styles.reputationSection}>
            <MemberReputation
              nativeTokenDecimals={nativeToken?.decimals}
              userReputation={reputationAmount || ''}
              userReputationPercentage={reputationPercentage || ''}
              showReputationPoints={!isMobile}
            />
          </div>
        )}
        <MemberActions
          canAdministerComments={canAdministerComments}
          colony={colony}
          userAddress={walletAddress || ''}
          isWhitelisted={isWhitelisted}
          isBanned={banned}
        />
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
