import React, { FC } from 'react';
import Nav from './partials/Nav/Nav';
import { navMenuItems } from './partials/consts';
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
      <Nav items={navMenuItems} />
      {isMobile && (
        <>
          <div className="border-t border-gray-200 mx-6 mb-3" />
          <SubNavigationMobile />
          <div className="flex flex-col items-center justify-between mx-6 border-t border-gray-200 mt-4">
            <div className="mb-6 mt-6">
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
