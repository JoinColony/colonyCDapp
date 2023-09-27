import React, { FC } from 'react';
import clsx from 'clsx';
import { useController } from 'react-hook-form';

import { isHexString } from 'ethers/lib/utils';
import { useUserSelect } from './hooks';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import { useUserByAddress } from '~hooks';
import useToggle from '~hooks/useToggle';
import { UserSelectProps } from './types';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import Icon from '~shared/Icon';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<UserSelectProps> = ({ name }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const usersOptions = useUserSelect(field.value);
  const [
    isUserSelectVisible,
    {
      toggle: toggleUserSelect,
      toggleOff: toggleUserSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const { user: userByAddress } = useUserByAddress(field.value);
  const userDisplayName = userByAddress?.profile?.displayName;

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isUserSelectVisible]);
  const fieldValueFormat: string = isHexString(field.value) ? field.value : '';

  return (
    <div className="sm:relative w-full flex items-center">
      <button
        type="button"
        ref={relativeElementRef}
        className={clsx(
          'flex text-md transition-colors md:hover:text-blue-400',
          {
            'text-gray-500': !isError,
            'text-negative-400': isError,
          },
        )}
        onClick={toggleUserSelect}
        aria-label={formatText({ id: 'ariaLabel.selectUser' })}
      >
        {userByAddress || field.value ? (
          <>
            <UserAvatar
              user={userByAddress}
              userName={userDisplayName || usersOptions.userFormat}
              size="xs"
              avatarClassName={
                usersOptions.isRecipientNotVerified ? 'text-warning-400' : ''
              }
            />
            {usersOptions.isUserVerified && (
              <span className="flex ml-2 text-blue-400">
                <Icon name="verified" />
              </span>
            )}
          </>
        ) : (
          formatText({ id: 'actionSidebar.selectMember' })
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
          ref={(ref) => {
            registerContainerRef(ref);
            portalElementRef.current = ref;
          }}
          isLoading={usersOptions.loading}
          className="z-[60]"
          isDefaultItemVisible
        />
      )}
      {usersOptions.isRecipientNotVerified && (
        <UserAvatarPopover
          userName={displayName || field.value}
          walletAddress={userByAddress?.walletAddress || field.value}
          aboutDescription={userByAddress?.profile?.bio || ''}
          user={userByAddress}
          avatarClassName={
            usersOptions.isRecipientNotVerified ? 'text-warning-400' : ''
          }
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
            title={formatText(
              { id: 'user.not.verified.warning' },
              {
                walletAddress: (userByAddress?.walletAddress ||
                  fieldValueFormat) && (
                  <span className="font-semibold block mt-2">
                    {userByAddress?.walletAddress || fieldValueFormat}
                  </span>
                ),
              },
            )}
            isAlt
            action={{
              type: 'call-to-action',
              actionText: formatText({ id: 'add.verified.member' }),
              onClick: () => {}, // @TODO: add action
            }}
            className="mt-4"
          />
        </UserAvatarPopover>
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
