import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({
  name,
  selectedWalletAddress = '',
  isErrors,
}) => {
  const { formatMessage } = useIntl();
  const { register, setValue } = useFormContext();
  const usersOptions = useUserSelect();
  const [isUserSelectVisible, { toggle: toggleUserSelect }] = useToggle();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { user } = useUserByName(selectedUser || '');
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;
  const { user: userByAddress } = useUserByAddress(selectedWalletAddress);

  useEffect(() => {
    setValue(name, user?.walletAddress || selectedWalletAddress);
  }, [setValue, name, user, selectedWalletAddress]);

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={clsx(styles.button, {
          'text-gray-600': !isErrors,
          'text-negative-400': isErrors,
        })}
        onClick={toggleUserSelect}
        aria-label={formatMessage({ id: 'ariaLabel.selectUser' })}
      >
        {selectedUser || userByAddress ? (
          <UserAvatar
            user={user || userByAddress}
            userName={userDisplayName || username || userByAddress?.name}
            size="xs"
          />
        ) : (
          formatMessage({ id: 'actionSidebar.selectMember' })
        )}
      </button>
      <input
        type="text"
        {...register(name)}
        name={name}
        id={name}
        className="hidden"
        value={selectedUser || ''}
      />
      {isUserSelectVisible && (
        <SearchSelect
          items={[usersOptions]}
          isOpen={isUserSelectVisible}
          onToggle={toggleUserSelect}
          onSelect={(value) => {
            setSelectedUser(value);
          }}
          isLoading={usersOptions.loading}
        />
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
