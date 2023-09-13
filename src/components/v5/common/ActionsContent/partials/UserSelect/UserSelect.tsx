import React, { FC, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';

import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useMobile, useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import IconWithTooltip from '~v5/shared/IconWithTooltip';
import Icon from '~shared/Icon';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({
  name,
  selectedWalletAddress = '',
  isError,
  isAddressVerified,
  isUserVerified,
}) => {
  const isMobile = useMobile();
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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { user } = useUserByName(selectedUser || '');
  const userDisplayName = user?.profile?.displayName;
  const { user: userByAddress } = useUserByAddress(
    recipient || selectedWalletAddress,
  );
  const { formErrors, changeFormErrorsState } = useActionFormContext();
  const splitWallet =
    isMobile && recipient ? splitWalletAddress(recipient) : recipient;

  return (
    <div className="sm:relative w-full">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className={clsx(styles.button, {
            'text-gray-500': !isError,
            'text-negative-400': isError,
          })}
          onClick={toggleUserSelect}
          aria-label={formatMessage({ id: 'ariaLabel.selectUser' })}
        >
          {recipient ? (
            <UserAvatar
              user={user || userByAddress}
              userName={userDisplayName || splitWallet}
              size="xs"
              isWarning={recipient && !isAddressVerified && !isUserVerified}
            />
          ) : (
            formatMessage({ id: 'actionSidebar.selectMember' })
          )}
          {recipient && isUserVerified && !isAddressVerified && (
            <span className="flex ml-2 text-blue-400">
              <Icon name="verified" />
            </span>
          )}

          {recipient && !isAddressVerified && !isUserVerified && (
            <IconWithTooltip
              tooltipContent={
                <FormattedMessage id="tooltip.wallet.address.warning" />
              }
              iconName="warning-circle"
              className="ml-2 text-warning-400"
            />
          )}
        </button>
      </div>
      <input type="text" id={name} className="hidden" {...field} />
      {isUserSelectVisible && (
        <SearchSelect
          items={[usersOptions]}
          isOpen={isUserSelectVisible}
          onToggle={toggleUserSelect}
          onSelect={(value) => {
            field.onChange(value);
            setSelectedUser(value);
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
