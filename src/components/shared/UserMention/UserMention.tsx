import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Link from '~shared/Link';
import Popover from '~shared/Popover';

import { MemberUser, User } from '~types';
// import UserInfoPopover from '../InfoPopover/UserInfoPopover';

import styles from './UserMention.css';

interface Props {
  user: User | MemberUser;

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
  user,
  to,
  hasLink,
  showInfo,
  popperOptions,
  ...props
}: Props) => {
  const fallbackTo = to || `/user/${user?.profile?.displayName}`;
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
        text={`@${user?.profile?.displayName}`}
        className={styles.mention}
        {...props}
      />
    ) : (
      <span className={styles.mention} {...props}>
        {' '}
        {`@${user?.profile?.displayName}`}
      </span>
    );

  if (!showInfo) {
    return renderUserMention();
  }

  // const renderContent = useMemo(() => {
  //   return <UserInfoPopover user={user} />;
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
