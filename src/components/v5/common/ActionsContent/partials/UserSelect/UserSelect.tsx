import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController } from 'react-hook-form';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({
  name,
  selectedWalletAddress = '',
  isError,
}) => {
  const { formatMessage } = useIntl();
  const { field } = useController({
    name,
  });
  const usersOptions = useUserSelect();
  const [isUserSelectVisible, { toggle: toggleUserSelect }] = useToggle();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { user } = useUserByName(selectedUser || '');
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;
  const { user: userByAddress } = useUserByAddress(selectedWalletAddress);
  const { formErrors, changeFormErrorsState } = useActionFormContext();

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={clsx(styles.button, {
          'text-gray-500': !isError,
          'text-negative-400': isError,
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
      <input type="text" id={name} className="hidden" {...field} />
      {isUserSelectVisible && (
        <SearchSelect
          items={[usersOptions]}
          isOpen={isUserSelectVisible}
          onToggle={toggleUserSelect}
          onSelect={(value) => {
            field.onChange(value);
            setSelectedUser(value);
            changeFormErrorsState(formErrors);
          }}
          isLoading={usersOptions.loading}
        />
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
