import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMemberModalContext } from '~context/MemberModalContext';
import Filter from '~v5/common/Filter';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';

import SubNavigation from '../pages/MembersPage/partials/SubNavigation';

import { useHeader } from './hooks';
import { HeaderProps } from './types';

const displayName = 'v5.frame.Header';

const Header: FC<HeaderProps> = ({ title }) => {
  const { formatMessage } = useIntl();
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isSubNavigationOpen,
  } = useHeader();
  const { setIsMemberModalOpen } = useMemberModalContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <h4 className="heading-4 mr-2">{formatMessage(title)}</h4>
        <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
        {isSubNavigationOpen && (
          <PopoverBase
            setTooltipRef={setTooltipRef}
            tooltipProps={getTooltipProps}
            withTooltipStyles={false}
            cardProps={{
              rounded: 's',
              hasShadow: true,
              className: 'py-4 px-2.5',
            }}
            classNames="w-full sm:max-w-[17.375rem]"
          >
            <SubNavigation
              onManageMembersClick={() => setIsMemberModalOpen(true)}
            />
          </PopoverBase>
        )}
      </div>
      <Filter />
    </div>
  );
};

Header.displayName = displayName;

export default Header;
