import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AddressZero } from '@ethersproject/constants';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import UserMention from '~shared/UserMention';
import { ListGroupItem } from '~shared/ListGroup';
import MemberReputation from '~shared/MemberReputation';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';
import IconTooltip from '~shared/IconTooltip';
import UserAvatar from '~shared/UserAvatar';
import { Member } from '~common/Members';

import { User, Colony } from '~gql';
import { ENTER } from '~types/index';
import { getMainClasses } from '~utils/css';

import MemberActions from './Actions';
import { createAddress } from '~utils/web3';

import queries from '~styles/queries.css';
import styles from './MembersListItem.css';

interface Props {
  extraItemContent?: (user: Member | User) => ReactNode;
  colony: Colony;
  onRowClick?: (user: Member | User) => void;
  showUserInfo: boolean;
  showUserReputation: boolean;
  domainId: number | undefined;
  canAdministerComments?: boolean;
  user: Member | User;
}

const MSG = defineMessages({
  whitelistedTooltip: {
    id: 'shared.MembersList.MembersListItem.whitelistedTooltip',
    defaultMessage: `Added to address book`,
  },
});

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = (props: Props) => {
  const {
    colony,
    domainId,
    extraItemContent,
    onRowClick,
    showUserInfo,
    showUserReputation,
    user: { user, reputationAmount, reputationPercentage },
    canAdministerComments,
  } = props;
  console.log(
    '🚀 ~ file: MembersListItem.tsx ~ line 62 ~ MembersListItem ~ reputationPercentage',
    reputationPercentage,
  );
  const {
    profile,
    name,
    walletAddress,
    banned = false,
    isWhitelisted = false,
  } = user as User & { banned: boolean; isWhitelisted: boolean };

  const isUserBanned = useMemo(
    () =>
      canAdministerComments !== undefined
        ? canAdministerComments && banned
        : banned,
    [banned, canAdministerComments],
  );

  // const userProfile = useUser(createAddress(walletAddress || AddressZero));

  // Determine when reputation has loaded
  const [reputationLoaded, setReputationLoaded] = useState<boolean>(false);

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
  const isMobile = useMediaQuery({ query: queries.query700 });

  return (
    <ListGroupItem>
      {/* Disable, as `role` is conditional */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={getMainClasses({}, styles, {
          hasCallbackFn: !!onRowClick,
          hasReputation: showUserReputation,
          reputationLoaded,
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
            address={walletAddress}
            user={user}
            showInfo={!onRowClick || showUserInfo}
            domainId={domainId}
            notSet={false}
            banned={isUserBanned}
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
              PLACEHOLDER
              {/* <UserMention hasLink={false} username={name} /> */}
            </span>
          )}
          <div className={styles.address}>
            <InvisibleCopyableAddress address={walletAddress}>
              <MaskedAddress address={walletAddress} />
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
              onReputationLoaded={setReputationLoaded}
              showReputationPoints={!isMobile}
              nativeTokenDecimals={nativeToken?.decimals}
              reputationAmount={reputationAmount}
              reputationPercentage={reputationPercentage}
            />
          </div>
        )}
        <MemberActions
          canAdministerComments={canAdministerComments}
          colony={colony}
          userAddress={walletAddress}
          isWhitelisted={isWhitelisted}
          isBanned={isUserBanned}
        />
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
