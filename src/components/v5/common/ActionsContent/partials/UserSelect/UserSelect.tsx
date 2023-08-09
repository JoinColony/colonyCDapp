import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({ name }) => {
  const { formatMessage } = useIntl();
  const { register, setValue } = useFormContext();
  const usersOptions = useUserSelect();
  const [isUserSelectVisible, { toggle: toggleUserSelect }] = useToggle();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { user } = useUserByName(selectedUser || '');
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={toggleUserSelect}
        aria-label={formatMessage({ id: 'ariaLabel.selectUser' })}
      >
        {selectedUser ? (
          <UserAvatar
            user={user}
            userName={userDisplayName || username}
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
            setValue(name, value);
          }}
          isLoading={usersOptions.loading}
        />
      )}
    </>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
