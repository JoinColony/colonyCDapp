import React, { FC, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';

import { isHexString } from 'ethers/lib/utils';
import { useUserSelect, useVerifyRecipient } from './hooks';
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
import Modal from '~v5/shared/Modal';
import noop from '~utils/noop';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import UserAvatarContent from '~v5/shared/UserAvatarPopover/partials/UserAvatarContent';

const displayName = 'v5.common.ActionsContent.partials.UserSelect';

const UserSelect: FC<SelectProps> = ({
  name,
  selectedWalletAddress = '',
  isError,
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useUserByName(selectedUser || '');
  const { isAddressVerified, isUserVerified } = useVerifyRecipient();

  const userDisplayName = user?.profile?.displayName;
  const { user: userByAddress } = useUserByAddress(
    recipient || selectedWalletAddress,
  );
  const { formErrors, onChangeRecipientVerification, changeFormErrorsState } =
    useActionFormContext();
  const splitWallet =
    isMobile && recipient ? splitWalletAddress(recipient) : recipient;
  const isRecipientNotVerified =
    recipient && !isAddressVerified && !isUserVerified;
  const isWalletAddressFormat = recipient && isHexString(recipient);

  useEffect(() => {
    onChangeRecipientVerification(isRecipientNotVerified);
  }, [isRecipientNotVerified, onChangeRecipientVerification]);

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
              isWarning={isRecipientNotVerified}
            />
          ) : (
            formatMessage({ id: 'actionSidebar.selectMember' })
          )}
          {recipient && isUserVerified && !isAddressVerified && (
            <span className="flex ml-2 text-blue-400">
              <Icon name="verified" />
            </span>
          )}
        </button>
        {isRecipientNotVerified && (
          <IconWithTooltip
            tooltipContent={
              isWalletAddressFormat && !isAddressVerified && !isUserVerified ? (
                <FormattedMessage id="tooltip.wallet.address.not.verified.warning" />
              ) : (
                <FormattedMessage id="tooltip.user.not.verified.warning" />
              )
            }
            iconName="warning-circle"
            className="ml-2 text-warning-400"
            ariaLabel={formatMessage({ id: 'ariaLabel.openModal' })}
            onClick={() => (isMobile ? setIsModalOpen(true) : noop)}
          />
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

      <Modal
        isFullOnMobile={false}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      >
        <div className="flex flex-col gap-6">
          <UserAvatarContent
            aboutDescription={user?.profile?.bio || ''}
            userName={user?.profile?.displayName}
            user={user}
            avatarSize="md"
            walletAddress={user?.walletAddress || recipient}
          />

          <NotificationBanner
            status="warning"
            title={<FormattedMessage id="tooltip.user.not.verified.warning" />}
            isAlt
            action={{
              type: 'call-to-action',
              actionText: <FormattedMessage id="add.verified.member" />,
              onClick: () => setIsModalOpen(false),
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

UserSelect.displayName = displayName;

export default UserSelect;
