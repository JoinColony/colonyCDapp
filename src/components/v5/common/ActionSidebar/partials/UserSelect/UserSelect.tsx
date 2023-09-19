import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController } from 'react-hook-form';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import { UserSelectProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<UserSelectProps> = ({ name }) => {
  const { formatMessage } = useIntl();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const usersOptions = useUserSelect();
  const [
    isUserSelectVisible,
    {
      toggle: toggleUserSelect,
      toggleOff: toggleUserSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const { user } = useUserByName(field.value);
  const userDisplayName = user?.profile?.displayName;
  const { user: userByAddress } = useUserByAddress(field.value);

  return (
    <div className="sm:relative w-full">
      <button
        type="button"
        className={clsx(
          'flex text-md transition-colors md:hover:text-blue-400',
          {
            'text-gray-500': !isError,
            'text-negative-400': isError,
          },
        )}
        onClick={toggleUserSelect}
        aria-label={formatMessage({ id: 'ariaLabel.selectUser' })}
      >
        {user || userByAddress ? (
          <UserAvatar
            user={user || userByAddress}
            userName={userDisplayName}
            size="xs"
          />
        ) : (
          formatMessage({ id: 'actionSidebar.selectMember' })
        )}
      </button>
      {isUserSelectVisible && (
        <SearchSelect
          items={[usersOptions]}
          isOpen={isUserSelectVisible}
          onToggle={toggleUserSelect}
          onSelect={(value) => {
            field.onChange(value);
            toggleUserSelectOff();
          }}
          ref={registerContainerRef}
          isLoading={usersOptions.loading}
        />
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
