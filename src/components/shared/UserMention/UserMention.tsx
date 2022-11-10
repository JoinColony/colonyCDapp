import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Link from '~shared/Link';
import Popover from '~shared/Popover';
// import UserInfoPopover from '../InfoPopover/UserInfoPopover';
// import { useUserQuery, useUserAddressQuery } from '~data/index';

import styles from './UserMention.css';

interface Props {
  /** A user's username (ENS) */
  username: string;

  /** Alternate place to link to. Defaults to user profile */
  to?: string;

  /** Either just display mention or link to profile or so  */
  hasLink?: boolean;

  /** Html title attribute  */
  title?: string;

  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;

  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };
}

const displayName = 'UserMention';

const UserMention = ({
  username,
  to,
  hasLink,
  showInfo,
  popperOptions,
  ...props
}: Props) => {
  const fallbackTo = to || `/user/${username}`;
  const trigger = showInfo ? 'click' : 'disabled';
  const showArrow = popperOptions && popperOptions.showArrow;

  // const { data: userAddressData } = useUserAddressQuery({
  //   variables: {
  //     name: username || '',
  //   },
  // });

  // const { data } = useUserQuery({
  //   variables: { address: userAddressData?.userAddress || '' },
  // });

  const renderUserMention = () =>
    hasLink ? (
      <Link
        to={fallbackTo}
        text={`@${username}`}
        className={styles.mention}
        {...props}
      />
    ) : (
      <span className={styles.mention} {...props}>
        {' '}
        {`@${username}`}
      </span>
    );

  if (!showInfo) {
    return renderUserMention();
  }

  // const { user } = data || {};

  // const renderContent = useMemo(() => {
  //   if (typeof user !== 'undefined') {
  //     return <UserInfoPopover user={user} />;
  //   }
  //   return <UserInfoPopover userNotAvailable />;
  // }, [user]);
  const renderContent = null;

  return (
    <Popover
      renderContent={renderContent}
      popperOptions={popperOptions}
      trigger={trigger}
      showArrow={showArrow}
    >
      {renderUserMention()}
    </Popover>
  );
};

UserMention.displayName = displayName;

export default UserMention;
