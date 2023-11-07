import React, { FC, PropsWithChildren } from 'react';

import { LEARN_MORE_PAYMENTS } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import LearnMore from '~shared/Extensions/LearnMore';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

import { useMainMenuItems } from './hooks';
import SharedLayout from './SharedLayout';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

const ColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  const mainMenuItems = useMainMenuItems();

  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();

  return (
    <SharedLayout
      mainMenuItems={mainMenuItems}
      mobileBottomContent={
        <div className="w-full flex flex-col gap-6">
          <Button
            iconName="plus"
            className="w-full"
            onClick={() => toggleActionSideBar()}
          >
            {formatText({ id: 'button.createNewAction' })}
          </Button>
          <LearnMore
            message={{
              id: `${displayName}.helpText`,
              defaultMessage: 'Need help and guidance? <a>Visit our docs</a>',
            }}
            href={LEARN_MORE_PAYMENTS}
          />
        </div>
      }
      hamburgerLabel={formatText({ id: 'menu' })}
    >
      {children}
    </SharedLayout>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
