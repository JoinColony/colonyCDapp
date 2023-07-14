import React, { FC } from 'react';

import UserAvatarPopover from '../UserAvatarPopover';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import Icon from '~shared/Icon';
import BurgerMenu from '../BurgerMenu';
import CardPermissions, { SubNavigation } from './partials';
import UserStatusComponent from './partials/UserStatus';
import { CardWithBiosProps } from './types';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks';
import PopoverBase from '../PopoverBase';
import { Contributor } from '~types';

const displayName = 'v5.CardWithBios';

const CardWithBios: FC<CardWithBiosProps> = ({
  userData,
  description,
  userStatus,
  shouldBeMenuVisible = true,
  permissions,
  userStatusTooltipDetails,
  isVerified,
}) => {
  const { user, reputationPercentage } = (userData as Contributor) || {};
  const { name, walletAddress, profile } = user || {};
  const { bio } = profile || {};
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();

  return (
    <div className="sm:max-w-[20.125rem] max-h-[9.25rem] rounded-lg border border-gray-200 bg-gray-25 p-5 relative">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserAvatarPopover
              userName={name}
              walletAddress={splitWalletAddress(walletAddress || '')}
              isVerified={isVerified}
              aboutDescription={bio || ''}
              // @TODO: add colonyReputationItems
              // colonyReputation={colonyReputationItems}
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
            {userStatus && userStatusTooltipDetails && (
              <UserStatusComponent
                userStatus={userStatus}
                userStatusTooltipDetails={userStatusTooltipDetails}
              />
            )}
            {shouldBeMenuVisible && (
              <>
                <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
                {visible && (
                  <PopoverBase
                    setTooltipRef={setTooltipRef}
                    tooltipProps={getTooltipProps}
                    withTooltipStyles={false}
                    cardProps={{
                      rounded: 's',
                      hasShadow: true,
                      className: 'py-4 px-2',
                    }}
                    classNames="w-full sm:max-w-[17.375rem]"
                  >
                    <SubNavigation user={user} />
                  </PopoverBase>
                )}
              </>
            )}
          </div>
        </div>

        {description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}

        <div className="flex justify-between items-center">
          {!!reputationPercentage && (
            <span className="flex items-center text-gray-600 text-3">
              <Icon name="star-not-filled" appearance={{ size: 'extraTiny' }} />
              <span className="inline-block ml-1 mr-2">
                {reputationPercentage}%
              </span>
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
