import React, { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import classNames from 'classnames';

import { HookFormCheckbox as Checkbox } from '~shared/Fields';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';
import UserMention from '~shared/UserMention';
import UserAvatar from '~shared/UserAvatar';
import { Address, User } from '~types';

import styles from './UserCheckbox.css';

interface Props {
  walletAddress: Address;
  name: string;
  checkedTooltipText?: string;
  unCheckedTooltipText?: string;
  showDisplayName?: boolean;
  user?: User;
}

const UserCheckbox = ({
  walletAddress,
  name,
  checkedTooltipText,
  unCheckedTooltipText,
  user,
  showDisplayName = true,
}: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: 'right' }) as any;

  const { profile } = user || {};
  const { displayName = walletAddress } = profile || {};

  return (
    <div
      className={classNames(styles.main, { [styles.notChecked]: !isChecked })}
    >
      <div className={styles.user}>
        <div ref={setTriggerRef}>
          <Checkbox
            name={name}
            value={walletAddress}
            className={styles.checkbox}
            onChange={(event) => setIsChecked(event.target.checked)}
          />
          {visible && (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: styles.tooltipContainer,
              })}
            >
              {isChecked ? checkedTooltipText : unCheckedTooltipText}
              <div {...getArrowProps({ className: styles.tooltipArrow })} />
            </div>
          )}
        </div>
        <UserAvatar size="xs" user={user} />
        <div className={styles.usernameSection}>
          {displayName && showDisplayName && (
            <span className={styles.displayName} title={displayName}>
              {displayName}
            </span>
          )}
          {user && (
            <span className={styles.username}>
              <UserMention hasLink={false} user={user} />
            </span>
          )}
          <div className={styles.address}>
            <InvisibleCopyableAddress address={walletAddress}>
              <MaskedAddress address={walletAddress} />
            </InvisibleCopyableAddress>
          </div>
        </div>
      </div>
    </div>
  );
};

UserCheckbox.displayName = 'common.ManageWhitelistDialog.UserCheckbox';

export default UserCheckbox;
