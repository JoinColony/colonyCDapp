import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';
import SubNavigation from './partials/SubNavigation';
import { useMembersPage } from './hooks';

const MembersPage: FC = () => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();
  const { formatMessage } = useIntl();

  return (
    <TwoColumns aside={<Navigation pageName="members" />}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="heading-4 mr-2">
            {formatMessage({ id: 'members.allMembers' })}
          </h4>
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
              <SubNavigation />
            </PopoverBase>
          )}
        </div>
        {/* @TODO add filters */}
      </div>
    </TwoColumns>
  );
};

export default MembersPage;
