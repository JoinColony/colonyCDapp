import React, { FC } from 'react';
import Nav from './partials/Nav/Nav';
import { navMenuItems } from './partials/Nav/consts';
import { useMobile } from '~hooks';
import { SubNavigationMobile } from '~common/Extensions/SubNavigation';
import { LEARN_MORE_PAYMENTS } from '~constants';
import LearnMore from '~shared/Extensions/LearnMore';
import Button from '~shared/Extensions/Button';

const displayName = 'common.Extensions.MainNavigation';

const MainNavigation: FC = () => {
  const isMobile = useMobile();

  return (
    <div className="py-6 sm:py-0">
      {isMobile && (
        <div className="inner">
          top navigation
          <div className="border-t border-gray-200 mt-3 mb-3" />
        </div>
      )}
      <Nav items={navMenuItems} />
      {isMobile && (
        <>
          <div className="border-t border-gray-200 mx-6 mt-3 mb-3" />
          <SubNavigationMobile />
          <div className="border-t border-gray-200 mx-6 mt-3 mb-6" />
          <div className="flex flex-col items-center justify-between px-3">
            <div className="mb-6">
              <Button text="Create new action" mode="secondaryOutline" isFullSize={isMobile} />
            </div>
            <LearnMore
              message={{
                id: `${displayName}.helpText`,
                defaultMessage: 'Need help and guidance? <a>Visit our docs</a>',
              }}
              href={LEARN_MORE_PAYMENTS}
            />
          </div>
        </>
      )}
    </div>
  );
};

MainNavigation.displayName = displayName;

export default MainNavigation;
