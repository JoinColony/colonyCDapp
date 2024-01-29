import clsx from 'clsx';
import { utils } from 'ethers';
import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { useRelativePortalElement, useUserByAddress, useToggle } from '~hooks';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect';
import UserAvatar from '~v5/shared/UserAvatar';
import UserPopover from '~v5/shared/UserPopover';

import { useUserSelect } from './hooks';
import { UserSelectProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<UserSelectProps> = ({ name }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const { usersOptions } = useUserSelect();
  const [
    isUserSelectVisible,
    {
      toggle: toggleUserSelect,
      toggleOff: toggleUserSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const { user: userByAddress, loading: userByAddressLoading } =
    useUserByAddress(field.value);
  const { readonly } = useAdditionalFormOptionsContext();

  const userDisplayName = userByAddressLoading
    ? formatText({ id: 'status.loading' }, { optionalText: '' })
    : userByAddress?.profile?.displayName || field.value;

  const userWalletAddress = field.value;

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isUserSelectVisible]);

  const selectedUserOption = usersOptions.options.find(
    (option) => option.value === field.value,
  );

  const selectedUser =
    userByAddress || selectedUserOption
      ? {
          profile: {
            displayName: selectedUserOption?.label,
            thumbnail: selectedUserOption?.thumbnail,
          },
          walletAddress: selectedUserOption?.walletAddress,
          isVerified: selectedUserOption?.isVerified,
        }
      : undefined;

  return (
    <div className="sm:relative w-full flex items-center">
      {readonly ? (
        <>
          <UserAvatar
            user={selectedUser || field.value}
            size="xs"
            showUsername
            className={clsx({
              'text-warning-400': !selectedUser?.isVerified,
            })}
          />
          {selectedUser?.isVerified && (
            <span className="flex ml-2 text-blue-400">
              <Icon name="verified" />
            </span>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx(
              'flex text-md transition-colors md:hover:text-blue-400',
              {
                'text-gray-400': !isError && !isUserSelectVisible,
                'text-negative-400': isError,
                'text-blue-400': isUserSelectVisible,
              },
            )}
            onClick={toggleUserSelect}
            aria-label={formatText({ id: 'ariaLabel.selectUser' })}
          >
            {selectedUser || field.value ? (
              <>
                <UserAvatar
                  user={selectedUser || field.value}
                  size="xs"
                  showUsername
                  className={clsx({
                    'text-warning-400': !selectedUser?.isVerified,
                    'text-gray-900': selectedUser?.isVerified,
                  })}
                />
                {selectedUser?.isVerified && (
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
              onSelect={(value) => {
                field.onChange(utils.isHexString(value) ? value : undefined);
                toggleUserSelectOff();
              }}
              onSearch={(query) => {
                field.onChange(utils.isHexString(query) ? query : undefined);
              }}
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
              isLoading={usersOptions.isLoading}
              className="z-[60]"
              showSearchValueAsOption
              showEmptyContent={false}
            />
          )}
          {!selectedUser?.isVerified && field.value && (
            <UserPopover
              userName={userDisplayName}
              walletAddress={userWalletAddress}
              aboutDescription={userByAddress?.profile?.bio || ''}
              user={userByAddress}
              className="text-warning-400"
              size="m"
            >
              <span className="flex ml-2 text-warning-400">
                <Icon name="warning-circle" />
              </span>
            </UserPopover>
          )}
        </>
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
