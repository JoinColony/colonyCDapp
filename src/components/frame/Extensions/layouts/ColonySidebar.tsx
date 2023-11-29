import React, { ReactNode } from 'react';

import { CREATE_COLONY_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import NavigationSidebar from '~v5/frame/NavigationSidebar';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import ColonySwitcherContent from './partials/ColonySwitcherContent';
import Button from '~v5/shared/Button';
import LearnMore from '~shared/Extensions/LearnMore';
import { LEARN_MORE_PAYMENTS } from '~constants';
import { useMainMenuItems } from './hooks';
import { useActionSidebarContext } from '~context';
import { getChainIconName } from './utils';
import { useColonyContext } from '~hooks';

const displayName = 'frame.Extensions.layouts.ColonyLayout.ColonySidebar';

interface Props {
  txButtons: ReactNode;
  userHub: ReactNode;
}

const ColonySidebar = ({ txButtons, userHub }: Props) => {
  const mainMenuItems = useMainMenuItems();
  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();
  const { colony } = useColonyContext();

  const { metadata, chainMetadata } = colony || {};
  const { chainId } = chainMetadata || {};

  const chainIcon = getChainIconName(chainId);

  return (
    <NavigationSidebar
      additionalMobileContent={
        <UserNavigationWrapper txButtons={txButtons} userHub={userHub} />
      }
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
      colonySwitcherProps={{
        avatarProps: {
          colonyImageProps: metadata?.avatar
            ? { src: metadata?.thumbnail || metadata?.avatar }
            : undefined,
          chainIconName: chainIcon,
          colonyAddress: colony?.colonyAddress,
        },
        content: {
          title: formatText({ id: 'navigation.colonySwitcher.title' }),
          content: <ColonySwitcherContent colony={colony} />,
          bottomActionProps: {
            text: formatText({ id: 'button.createNewColony' }),
            iconName: 'plus',
            to: CREATE_COLONY_ROUTE,
          },
        },
      }}
      mainMenuItems={mainMenuItems}
    />
  );
};

ColonySidebar.displayName = displayName;

export default ColonySidebar;
