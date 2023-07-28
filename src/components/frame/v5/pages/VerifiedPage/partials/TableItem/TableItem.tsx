import React, { FC, useCallback, useState } from 'react';

import { TableItemProps } from './types';
import { useColonyContext, useUserReputation } from '~hooks';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import Icon from '~shared/Icon';
import { calculatePercentageReputation } from '~utils/reputation';
import styles from './TableItem.module.css';
import Checkbox from '~v5/common/Checkbox';
import { formatMessage } from '~utils/yup/tests/helpers';

const displayName = 'v5.pages.VerifiedPage.partials.TableItem';

const TableItem: FC<TableItemProps> = ({ member, onDeleteClick, onChange }) => {
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { user } = member || {};
  const { walletAddress, name, profile } = user || {};
  const { bio } = profile || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    walletAddress,
  );
  const reputationPercentage = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );
  const [isChecked, setIsChecked] = useState<boolean>();

  const handleChange = useCallback(
    (e) => {
      setIsChecked(e.target.checked);
      onChange(e);
    },
    [setIsChecked, onChange],
  );

  return (
    <div className={styles.tableItem}>
      <div className="flex items-center">
        <Checkbox
          id={`verified-${name}`}
          name={`verified-${name}`}
          isChecked={isChecked}
          onChange={(e) => handleChange(e)}
        />
        <div className="ml-1 flex">
          <UserAvatarPopover
            userName={name}
            walletAddress={splitWalletAddress(walletAddress || '')}
            aboutDescription={bio || ''}
            // @TODO: add colonyReputationItems
            // colonyReputation={colonyReputationItems}
            user={user}
            avatarSize="xs"
            isVerified
            // permissions={permissionsItems}
          />
        </div>
        <span className="ml-1 flex shrink-0 text-blue-400">
          <Icon name="verified" appearance={{ size: 'tiny' }} />
        </span>
      </div>
      <div className="hidden sm:flex items-center">status</div>
      <div className="hidden sm:flex items-center">
        <Icon name="star" appearance={{ size: 'small' }} />
        <span className="ml-1 text-sm text-gray-600">
          {reputationPercentage || '0'}%
        </span>
      </div>
      <div className="hidden sm:flex items-center">permissions</div>
      <div className="flex">
        <button
          type="button"
          className="ml-auto flex items-center hover:text-negative-400 transition-colors duration-normal"
          aria-label={formatMessage({ id: 'ariaLabel.deleteMember' })}
          onClick={onDeleteClick}
        >
          <Icon name="trash" appearance={{ size: 'small' }} />
        </button>
      </div>
    </div>
  );
};

TableItem.displayName = displayName;

export default TableItem;
