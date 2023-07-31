import React, { FC } from 'react';

import { useColonyContext, useMobile } from '~hooks';
import { LEARN_MORE_PAYMENTS } from '~constants';
import Nav from './partials/Nav';
import { useGetNavItems } from './partials/hooks';
import { SubNavigationMobile } from '~v5/common/SubNavigation';
import LearnMore from '~shared/Extensions/LearnMore';
import Button from '~v5/shared/Button';
import { MainNavigationProps } from './types';
import PopoverBase from '~v5/shared/PopoverBase';
import NavigationTools from '../NavigationTools';

const displayName = 'common.Extensions.MainNavigation';

const MainNavigation: FC<MainNavigationProps> = ({
  setTooltipRef,
  tooltipProps,
  isMenuOpen,
}) => {
  const { colony } = useColonyContext();
  const { name, nativeToken } = colony || {};
  const isMobile = useMobile();
  const navItems = useGetNavItems(name);

  return (
    <div>
      {!isMobile && <Nav items={navItems} />}
      {isMobile && isMenuOpen && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={tooltipProps}
          classNames="w-full border-none shadow-none px-0 pt-0 pb-6 bg-base-white"
        >
          <div className="w-full pt-[5.5625rem] sm:pt-0">
            <NavigationTools nativeToken={nativeToken} />
            <span className="divider mb-3" />
            <div className="px-6">
              <Nav items={navItems} />
              <span className="divider mb-3" />
              <SubNavigationMobile />
              <div className="flex flex-col items-center justify-between border-t border-gray-200 mt-3">
                <div className="my-6 w-full">
                  <Button
                    text="Create new action"
                    mode="quinary"
                    isFullSize={isMobile}
                  />
                </div>
                <LearnMore
                  message={{
                    id: `${displayName}.helpText`,
                    defaultMessage:
                      'Need help and guidance? <a>Visit our docs</a>',
                  }}
                  href={LEARN_MORE_PAYMENTS}
                />
              </div>
            </div>
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

MainNavigation.displayName = displayName;

export default MainNavigation;
