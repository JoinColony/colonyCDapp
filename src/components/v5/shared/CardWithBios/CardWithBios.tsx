import React, { FC } from 'react';

import { useUserByNameOrAddress } from '~hooks';
import { AnyExtensionData, InstalledExtensionData } from '~types';

import UserAvatarPopover from '../UserAvatarPopover/UserAvatarPopover';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { useGetInstalledByData } from '~common/Extensions/SpecificSidePanel/partials/hooks';
import Icon from '~shared/Icon';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import CardPermissions from './partials';
import UserStatusComponent from './partials/UserStatus';
import { CardWithBiosProps } from './types';

const displayName = 'v5.shared.CardWithBios';

const CardWithBios: FC<CardWithBiosProps> = ({
  description,
  extensionData,
  percentage,
  userStatus,
  shouldBeMenuVisible = true,
  permissions,
  userStatusTooltipDetails,
  isVerified,
}) => {
  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );
  const { bio } = user?.profile || {};
  const username = user?.name;
  const installedByData = useGetInstalledByData(
    extensionData as AnyExtensionData,
  );
  const { colonyReputationItems } = installedByData || {};

  return (
    <div className="max-w-[322px] max-h-[148px] rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserAvatarPopover
              userName={username || 'panda'}
              walletAddress={splitWalletAddress(user?.walletAddress || '')}
              isVerified={isVerified}
              aboutDescription={bio || ''}
              colonyReputation={colonyReputationItems}
              user={user}
              userStatus={userStatus}
              avatarSize="sm"
              // permissions={permissionsItems}
            />
            {isVerified && (
              <span className="ml-1 flex shrink-0 text-blue-400">
                <Icon name="verified" appearance={{ size: 'tiny' }} />
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {userStatus && (
              <UserStatusComponent
                userStatus={userStatus}
                userStatusTooltipDetails={userStatusTooltipDetails}
              />
            )}
            {/* @TODO: add dropdown component */}
            {shouldBeMenuVisible && <BurgerMenu isVertical />}
          </div>
        </div>

        {description && (
          <div className="text-gray-600 text-sm">{description}</div>
        )}

        <div className="flex justify-between items-center">
          {!!percentage && (
            <span className="flex items-center text-gray-600 text-3">
              <Icon name="star-not-filled" appearance={{ size: 'extraTiny' }} />
              <span className="inline-block ml-1 mr-2">{percentage}%</span>
            </span>
          )}

          {permissions && <CardPermissions permissions={permissions} />}
        </div>
      </div>
    </div>
  );
};

CardWithBios.displayName = displayName;

export default CardWithBios;
