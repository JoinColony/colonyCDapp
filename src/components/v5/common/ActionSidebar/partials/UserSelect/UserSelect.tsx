import { CircleWavyCheck, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { utils } from 'ethers';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { formatText } from '~utils/intl.ts';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { useUserSelect } from './hooks.ts';
import { type UserSelectProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<UserSelectProps> = ({ name, disabled }) => {
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
            displayName:
              selectedUserOption?.label || userByAddress?.profile?.displayName,
            thumbnail:
              selectedUserOption?.thumbnail ||
              userByAddress?.profile?.thumbnail,
          },
          walletAddress:
            selectedUserOption?.walletAddress || userByAddress?.walletAddress,
          isVerified: selectedUserOption?.isVerified,
        }
      : undefined;

  return (
    <div className="flex w-full items-center sm:relative">
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
            <CircleWavyCheck
              size={14}
              className="ml-1 flex-shrink-0 text-blue-400"
            />
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            ref={relativeElementRef}
            className={clsx('flex items-center text-md transition-colors', {
              'text-gray-400': !isError && !isUserSelectVisible,
              'text-negative-400': isError,
              'text-blue-400': isUserSelectVisible,
              'md:hover:text-blue-400': !disabled,
            })}
            onClick={toggleUserSelect}
            aria-label={formatText({ id: 'ariaLabel.selectUser' })}
            disabled={disabled}
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
                  <CircleWavyCheck
                    size={14}
                    className="ml-1 flex-shrink-0 text-blue-400"
                  />
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
              className="z-sidebar"
              showEmptyContent={false}
            />
          )}
          {!selectedUser?.isVerified && field.value && (
            <UserPopover
              userName={userDisplayName}
              walletAddress={userWalletAddress}
              aboutDescription={userByAddress?.profile?.bio || ''}
              user={userByAddress}
              className="ml-1"
              size="m"
            >
              <WarningCircle size={14} className="text-warning-400" />
            </UserPopover>
          )}
        </>
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
