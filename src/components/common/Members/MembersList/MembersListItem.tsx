import React, { ReactNode, useMemo } from 'react';

import { ListGroupItem } from '~shared/ListGroup';
import MemberReputation from '~shared/MemberReputation';
import UserAvatar from '~shared/UserAvatar';

import { Contributor, Member, MemberUser } from '~types';
import { getMainClasses } from '~utils/css';
import { useColonyContext, useMobile } from '~hooks';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import MemberActions from './Actions';
import MemberInfo from './MemberInfo';

import styles from './MembersListItem.css';

interface Props {
  extraItemContent?: (user: MemberUser | null | undefined) => ReactNode;
  showUserInfo: boolean;
  showUserReputation: boolean;
  member: Member;
}

const displayName = 'MembersList.MembersListItem';

const MembersListItem = ({ extraItemContent, showUserInfo, showUserReputation, member: { user }, member }: Props) => {
  const { walletAddress } = user || {};
  const { colony } = useColonyContext();
  const { reputationAmount, reputationPercentage } = member as Contributor;

  const renderedExtraItemContent = useMemo(
    () => (extraItemContent ? extraItemContent(user) : null),
    [extraItemContent, user],
  );

  const isMobile = useMobile();
  // Temp hardcoded values until the features are implemented
  const isWhitelisted = false;

  return (
    <ListGroupItem>
      {/* Disable, as `role` is conditional */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={getMainClasses({}, styles, {
          hasReputation: showUserReputation,
        })}
      >
        <div className={styles.section}>
          <UserAvatar
            size="s"
            user={user}
            showInfo={showUserInfo}
            notSet={false}
            // banned={isUserBanned}
            popperOptions={isMobile ? { placement: 'bottom' } : undefined}
          />
        </div>
        <MemberInfo isWhitelisted={isWhitelisted} user={user} />
        {renderedExtraItemContent && !isMobile && <div>{renderedExtraItemContent}</div>}
        {showUserReputation && (
          <div className={styles.reputationSection}>
            <MemberReputation
              nativeTokenDecimals={colony?.nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
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
