import { CircleWavyCheck, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { type User } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { renderUserOption } from '~v5/shared/SearchSelect/partials/OptionRenderer/UserOptionRenderer.tsx';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { useUserSelect } from './hooks.ts';
import { type UserSelectProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<UserSelectProps> = ({
  name,
  disabled,
  domainId,
  filterOptionsFn,
  tooltipContent,
  options,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });
  const isError = !!error;
  const { usersOptions } = useUserSelect({ domainId, filterOptionsFn });
  const [
    isUserSelectVisible,
    {
      toggle: toggleUserSelect,
      toggleOff: toggleUserSelectOff,
      registerContainerRef,
    },
  ] = useToggle();
  const { user: userByAddress } = useUserByAddress(field.value);
  const { readonly } = useAdditionalFormOptionsContext();

  const userWalletAddress = field.value;

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isUserSelectVisible], {
    top: 8,
  });

  const selectedUserOption = (options || usersOptions).options.find(
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
            avatar: selectedUserOption?.thumbnail,
          },
          walletAddress:
            selectedUserOption?.walletAddress || userByAddress?.walletAddress,
          isVerified: selectedUserOption?.isVerified,
        }
      : undefined;

  const getUserName = () => {
    if (!userWalletAddress) {
      return null;
    }
    return (
      selectedUser?.profile?.displayName ??
      splitWalletAddress(userWalletAddress)
    );
  };

  const userName = getUserName();
  const isUserAddressValid = field.value && isAddress(field.value);
  const toggler = (
    <>
      <button
        type="button"
        ref={relativeElementRef}
        className={clsx('flex items-center text-md transition-colors', {
          'text-gray-400': !isError && !isUserSelectVisible && !disabled,
          'text-gray-300': disabled,
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
            {isUserAddressValid ? (
              <>
                <UserAvatar
                  userName={
                    selectedUser?.profile?.displayName?.toString() ?? undefined
                  }
                  userAddress={userWalletAddress}
                  userAvatarSrc={selectedUser?.profile?.avatar ?? undefined}
                  size={20}
                />
                <p
                  className={clsx('ml-2 truncate text-md font-medium', {
                    'text-warning-400': !selectedUser?.isVerified,
                    'text-gray-900': selectedUser?.isVerified,
                  })}
                >
                  {formatText(userName || '')}
                </p>
                {selectedUser?.isVerified && (
                  <CircleWavyCheck
                    size={14}
                    className="ml-1 flex-shrink-0 text-blue-400"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center gap-1 text-negative-400">
                <WarningCircle size={16} />
                <span className="text-md">
                  {formatText({
                    id: 'actionSidebar.addressError',
                  })}
                </span>
              </div>
            )}
          </>
        ) : (
          formatText({ id: 'actionSidebar.selectMember' })
        )}
      </button>
      {(selectedUser || field.value) &&
        !selectedUser?.isVerified &&
        isUserAddressValid && (
          <UserInfoPopover
            walletAddress={userWalletAddress}
            user={selectedUser as User}
            withVerifiedBadge={false}
            className="flex w-auto max-w-full flex-col items-center justify-between gap-2 text-gray-900"
          >
            <WarningCircle
              size={14}
              className="ml-1 flex-shrink-0 text-warning-400"
            />
          </UserInfoPopover>
        )}
    </>
  );

  const selectedUserContent = (
    <>
      {tooltipContent ? (
        <Tooltip
          tooltipContent={tooltipContent}
          trigger={!isUserAddressValid ? 'hover' : undefined}
          placement={isUserAddressValid ? 'top' : 'bottom'}
        >
          {toggler}
        </Tooltip>
      ) : (
        toggler
      )}
    </>
  );

  return (
    <div className="flex w-full items-center sm:relative">
      {readonly && selectedUser?.walletAddress ? (
        <>
          <UserAvatar
            userName={
              selectedUser?.profile?.displayName?.toString() ?? undefined
            }
            userAddress={selectedUser.walletAddress}
            userAvatarSrc={selectedUser?.profile?.avatar ?? undefined}
            size={20}
          />
          <p
            className={clsx('ml-2 truncate text-md font-medium text-gray-900', {
              'text-warning-400': !selectedUser?.isVerified,
            })}
          >
            {formatText(userName || '')}
          </p>
          {selectedUser?.isVerified && (
            <CircleWavyCheck
              size={14}
              className="ml-1 flex-shrink-0 text-blue-400"
            />
          )}
        </>
      ) : (
        <>
          {selectedUserContent}
          {isUserSelectVisible && (
            <SearchSelect
              renderOption={renderUserOption}
              placeholder={formatText({
                id: 'placeholder.searchUser',
              })}
              items={[options || usersOptions]}
              onSelect={(value) => {
                field.onChange(utils.isHexString(value) ? value : undefined);
                toggleUserSelectOff();
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
        </>
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
