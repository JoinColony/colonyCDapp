import React, { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserAvatarPopover from '../UserAvatarPopover';
import Icon from '~shared/Icon';
import BurgerMenu from '../BurgerMenu';
import { SubNavigation } from './partials';
import UserStatusComponent from './partials/UserStatus';
import { CardWithBiosProps } from './types';
import PopoverBase from '../PopoverBase';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';

const displayName = 'v5.CardWithBios';

const CardWithBios: FC<CardWithBiosProps> = ({
  userData,
  description,
  shouldBeMenuVisible = true,
  isContributorsList,
}) => {
  const { user, colonyReputationPercentage, type, contributorAddress } =
    userData || {};
  const userStatus = (type?.toLowerCase() ??
    null) as ContributorTypeFilter | null;

  const { walletAddress = contributorAddress } = user || {};

  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isUserDetailsOpen,
  } = usePopperTooltip({
    delayShow: 200,
    delayHide: 200,
    placement: 'bottom-start',
    trigger: ['click'],
    interactive: true,
  });

  return (
    <div className="max-h-[9.25rem] rounded-lg border border-gray-200 bg-gray-25 p-5 relative">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserAvatarPopover
              user={user}
              walletAddress={walletAddress}
              isContributorsList={isContributorsList}
            />
          </div>

          <div className="flex gap-2">
            {userStatus && userStatus !== 'general' && isContributorsList && (
              <UserStatusComponent userStatus={userStatus} />
            )}
            {shouldBeMenuVisible && (
              <>
                <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
                {isUserDetailsOpen && (
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
          {!!colonyReputationPercentage && (
            <span className="flex items-center text-gray-600 text-3">
              <Icon name="star-not-filled" appearance={{ size: 'extraTiny' }} />
              <span className="inline-block ml-1 mr-2">
                {Number.isInteger(colonyReputationPercentage)
                  ? colonyReputationPercentage
                  : colonyReputationPercentage.toFixed(2)}
                %
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

CardWithBios.displayName = displayName;

export default CardWithBios;
