import { CircleWavyCheck, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { utils } from 'ethers';
import React, { type FC } from 'react';
import { useController } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import SearchSelect from '~v5/shared/SearchSelect/SearchSelect.tsx';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

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
  >([isUserSelectVisible]);

  const selectedUserOption = (options || usersOptions).options.find(
    (option) => option.value === field.value,
  );

  const selectedUser =
    userByAddress || selectedUserOption
      ? {
          profile: {
            displayName: selectedUserOption?.label,
            avatar: selectedUserOption?.thumbnail,
          },
          walletAddress: selectedUserOption?.walletAddress,
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

  const toggler = (
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
        formatText({ id: 'actionSidebar.selectMember' })
      )}
    </button>
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
          {tooltipContent ? (
            <Tooltip
              tooltipContent={tooltipContent}
              // selectTriggerRef={(triggerRef) => {
              //   if (!triggerRef) {
              //     return null;
              //   }

              //   return triggerRef.querySelector(`.${LABEL_CLASSNAME}`);
              // }}
              placement="top"
            >
              {toggler}
            </Tooltip>
          ) : (
            toggler
          )}
          {isUserSelectVisible && (
            <SearchSelect
              items={[options || usersOptions]}
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
            <UserInfoPopover
              walletAddress={userWalletAddress}
              user={userByAddress}
              className="ml-1 text-warning-400"
            >
              <span className="ml-2 flex text-warning-400">
                <WarningCircle size={20} />
              </span>
            </UserInfoPopover>
          )}
        </>
      )}
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
