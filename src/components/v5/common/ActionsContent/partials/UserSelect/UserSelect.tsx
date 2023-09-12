import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({ name, isError }) => {
  const { formatMessage } = useIntl();
  const { field } = useController({
    name,
  });
  const { watch } = useFormContext();
  const { recipient } = watch();

  const usersOptions = useUserSelect();
  const [
    isUserSelectVisible,
    { toggle: toggleUserSelect, toggleOff: toggleUserSelectOff },
  ] = useToggle();

  const { user } = useUserByName(recipient || '');
  const { user: userByAddress } = useUserByAddress(recipient || '');
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
        {recipient || userByAddress ? (
          <UserAvatar
            user={user || userByAddress}
            userName={splitWalletAddress(recipient || '')}
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
            toggleUserSelectOff();
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
