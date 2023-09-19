import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';
import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect';
import { useDetectClickOutside, useUserByAddress, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import Icon from '~shared/Icon';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import UserAvatar from '~v5/shared/UserAvatar';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({
  name,
  selectedWalletAddress,
  isError,
}) => {
  const intl = useIntl();
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
  const { user: userByAddress } = useUserByAddress(
    recipient || selectedWalletAddress,
  );

  const ref = useDetectClickOutside({
    onTriggered: () => toggleUserSelectOff(),
  });

  const { formErrors, onChangeRecipientVerification, changeFormErrorsState } =
    useActionFormContext();

  useEffect(() => {
    onChangeRecipientVerification(usersOptions.isRecipientNotVerified);
  }, [usersOptions.isRecipientNotVerified, onChangeRecipientVerification]);

  return (
    <div className="sm:relative w-full">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className={clsx(styles.button, 'flex items-center', {
            'text-gray-500': !isError,
            'text-negative-400': isError,
          })}
          onClick={toggleUserSelect}
          aria-label={intl.formatMessage({ id: 'ariaLabel.selectUser' })}
          ref={ref}
        >
          {recipient ? (
            <>
              <UserAvatar
                user={user || userByAddress}
                userName={usersOptions.userFormat}
                size="xs"
                isWarning={usersOptions.isRecipientNotVerified}
              />
              {recipient &&
                usersOptions.isUserVerified &&
                !usersOptions.isAddressVerified && (
                  <span className="flex ml-2 text-blue-400">
                    <Icon name="verified" />
                  </span>
                )}
            </>
          ) : (
            intl.formatMessage({ id: 'actionSidebar.selectMember' })
          )}
        </button>
        {usersOptions.isRecipientNotVerified && (
          <UserAvatarPopover
            userName={recipient}
            walletAddress={user?.walletAddress || recipient}
            aboutDescription={user?.profile?.bio || ''}
            user={user || userByAddress}
            className={clsx(styles.button, {
              'text-gray-500': !isError,
              'text-negative-400': isError,
            })}
            isWarning={usersOptions.isRecipientNotVerified}
            avatarSize="xs"
            userFormat={usersOptions.userFormat}
            popoverButtonContent={
              <button type="button">
                <span className="flex ml-2 text-warning-400">
                  <Icon name="warning-circle" />
                </span>
              </button>
            }
          >
            <NotificationBanner
              status="notVerified"
              title={intl.formatMessage(
                { id: 'tooltip.user.not.verified.warning' },
                {
                  walletAddress: (
                    <span className="font-semibold block mt-2">
                      {user?.walletAddress || recipient}
                    </span>
                  ),
                },
              )}
              isAlt
              action={{
                type: 'call-to-action',
                actionText: intl.formatMessage({ id: 'add.verified.member' }),
                onClick: () => {}, // @TODO: add action
              }}
              className="mt-4"
            />
          </UserAvatarPopover>
        )}
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
          isDefaultItemVisible
        />
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
