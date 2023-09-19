import React, { FC, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';
import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect';
import { useDetectClickOutside, useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';
import styles from '../../ActionsContent.module.css';
import { SelectProps } from '../../types';
import { useActionFormContext } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import Icon from '~shared/Icon';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { user } = useUserByName(selectedUser || '');
  const { formErrors, onChangeRecipientVerification, changeFormErrorsState } =
    useActionFormContext();
  const isRecipientNotVerified =
    recipient &&
    !usersOptions.isAddressVerified &&
    !usersOptions.isUserVerified;

  useEffect(() => {
    onChangeRecipientVerification(isRecipientNotVerified);
  }, [isRecipientNotVerified, onChangeRecipientVerification]);

  const ref = useDetectClickOutside({
    onTriggered: () => toggleUserSelectOff(),
  });

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
          aria-label={formatMessage({ id: 'ariaLabel.selectUser' })}
          ref={ref}
        >
          {recipient ? (
            <>
              <UserAvatarPopover
                userName={recipient}
                walletAddress={user?.walletAddress || recipient}
                aboutDescription={user?.profile?.bio || ''}
                user={user}
                className={clsx(styles.button, {
                  'text-gray-500': !isError,
                  'text-negative-400': isError,
                })}
                isWarning={isRecipientNotVerified}
                avatarSize="xs"
              >
                <NotificationBanner
                  status="warning"
                  title={
                    <FormattedMessage id="tooltip.user.not.verified.warning" />
                  }
                  isAlt
                  action={{
                    type: 'call-to-action',
                    actionText: <FormattedMessage id="add.verified.member" />,
                    onClick: () => {},
                  }}
                />
              </UserAvatarPopover>
              {isRecipientNotVerified && (
                <span className="flex ml-2 text-warning-400 ">
                  <Icon name="warning-circle" />
                </span>
              )}
              {recipient &&
                usersOptions.isUserVerified &&
                !usersOptions.isAddressVerified && (
                  <span className="flex ml-2 text-blue-400">
                    <Icon name="verified" />
                  </span>
                )}
            </>
          ) : (
            formatMessage({ id: 'actionSidebar.selectMember' })
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
          isDefaultItemVisible
        />
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
