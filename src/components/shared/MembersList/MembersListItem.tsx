import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';

// import UserMention from '~shared/UserMention';
import { ListGroupItem } from '~shared/ListGroup';
import MemberReputation from '~shared/MemberReputation';
import UserAvatar from '~shared/UserAvatar';

import { Contributor, Member } from '~types';
import { ENTER } from '~types/index';
import { getMainClasses } from '~utils/css';
import { useColonyContext, useMobile } from '~hooks';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { notNull } from '~utils/arrays';

import MemberActions from './Actions';
import MemberInfo from './MemberInfo';

import styles from './MembersListItem.css';

type User = Member['user'];

interface Props {
  extraItemContent?: (user: User) => ReactNode;
  onRowClick?: (user: User) => void;
  showUserInfo: boolean;
  showUserReputation: boolean;
  member: Member;
}

const displayName = 'MembersList.MembersListItem';

const MembersListItem = ({
  extraItemContent,
  onRowClick,
  showUserInfo,
  showUserReputation,
  member: { user },
  member,
}: Props) => {
  const { walletAddress } = user || {};
  const { colony } = useColonyContext();
  const { reputationAmount, reputationPercentage } = member as Contributor;

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

  const nativeToken = colony?.tokens?.items
    .filter(notNull)
    .find(
      ({ token }) => token?.tokenAddress === colony.nativeToken.tokenAddress,
    );
  const isMobile = useMobile();
  // Temp hardcoded values until the features are implemented
  const isWhitelisted = true;

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
        <MemberInfo isWhitelisted={isWhitelisted} user={user} />
        {renderedExtraItemContent && !isMobile && (
          <div>{renderedExtraItemContent}</div>
        )}
        {showUserReputation && (
          <div className={styles.reputationSection}>
            <MemberReputation
              nativeTokenDecimals={
                nativeToken?.token.decimals || DEFAULT_TOKEN_DECIMALS
              }
              userReputation={reputationAmount || ''}
              userReputationPercentage={reputationPercentage || ''}
              showReputationPoints={!isMobile}
            />
          </div>
        )}
        <MemberActions userAddress={walletAddress || ''} />
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = displayName;

export default MembersListItem;
