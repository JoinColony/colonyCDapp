import { Star } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { type ContributorTypeFilter } from '~v5/common/TableFiltering/types.ts';

import KebapMenu from '../KebapMenu/index.ts';
import PopoverBase from '../PopoverBase/index.ts';
import UserPopover from '../UserPopover/index.ts';

import { SubNavigation } from './partials/index.ts';
import UserStatusComponent from './partials/UserStatus.tsx';
import { type CardWithBiosProps } from './types.ts';

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
    <div className="relative max-h-[9.25rem] rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserPopover size={20} walletAddress={walletAddress} />
          </div>
          <div className="flex gap-2">
            {userStatus && userStatus !== 'general' && isContributorsList && (
              <UserStatusComponent userStatus={userStatus} />
            )}
            {shouldBeMenuVisible && (
              <>
                <KebapMenu isVertical setTriggerRef={setTriggerRef} />
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
                    className="w-full sm:max-w-[17.375rem]"
                  >
                    <SubNavigation user={user} />
                  </PopoverBase>
                )}
              </>
            )}
          </div>
        </div>

        {description && (
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        <div className="flex items-center justify-between">
          {!!colonyReputationPercentage && (
            <span className="flex items-center text-gray-600 text-3">
              <Star size={12} />
              <span className="ml-1 mr-2 inline-block">
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
