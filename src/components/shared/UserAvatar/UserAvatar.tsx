import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Avatar from '~shared/Avatar';
// import InfoPopover, { Props as InfoPopoverProps } from '~shared/InfoPopover';
import Link from '~shared/NavLink';
import { Address } from '~types';
// import { AnyUser, Colony } from '~data/index';
// import { getUsername } from '~redux/transformers';

import styles from './UserAvatar.css';
import { getMainClasses } from '~utils/css';

interface BaseProps {
  /** Address of the current user for identicon fallback */
  address: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** The corresponding user object if available */
  // user?: AnyUser;
  user?: Record<string, unknown>;

  /** Banned comment status */
  banned?: boolean;
}

/** Used for the infopopover */
interface PropsForReputation extends BaseProps {
  // colony?: Colony;
  colony?: Record<string, unknown>;
  domainId?: number;
}

export type Props = BaseProps | PropsForReputation;

const displayName = 'UserAvatar';

const UserAvatar = ({
  address,
  avatarURL,
  className,
  showInfo,
  showLink,
  notSet,
  popperOptions,
  size,
  banned = false,
  user = {
    id: address,
    profile: { walletAddress: address },
  },
  ...rest
}: Props) => {
  // const username = getUsername(user);
  const username = 'tempUser';
  // let popoverProps: InfoPopoverProps = {
  //   popperOptions,
  //   trigger: showInfo ? 'click' : 'disabled',
  //   user,
  //   showArrow: popperOptions && popperOptions.showArrow,
  // };
  // if ('colony' in rest) {
  //   const { colony, domainId } = rest;
  //   popoverProps = {
  //     ...popoverProps,
  //     banned,
  //     colony,
  //     domainId,
  //   };
  // }
  // const avatar = (
  //   <InfoPopover {...popoverProps}>
  //     <div
  //       // @ts-ignore
  //       className={getMainClasses({}, styles, {
  //         showOnClick: popoverProps.trigger === 'click',
  //       })}
  //     >
  //       <Avatar
  //         avatarURL={avatarURL}
  //         className={className}
  //         notSet={typeof notSet === 'undefined' ? true : notSet}
  //         placeholderIcon="circle-person"
  //         seed={address && address.toLowerCase()}
  //         size={size}
  //         title={showInfo ? '' : username || address}
  //       />
  //     </div>
  //   </InfoPopover>
  // );
  // if (showLink && username) {
  //   // Won't this always be lowercase?
  //   return <Link to={`/user/${username.toLowerCase()}`}>{avatar}</Link>;
  // }
  // return avatar;
  return (
    <Avatar
      avatarURL={avatarURL}
      className={className}
      notSet={typeof notSet === 'undefined' ? true : notSet}
      placeholderIcon="circle-person"
      seed={address && address.toLowerCase()}
      size={size}
      title={showInfo ? '' : username || address}
    />
  );
};

UserAvatar.displayName = displayName;

export default UserAvatar;
