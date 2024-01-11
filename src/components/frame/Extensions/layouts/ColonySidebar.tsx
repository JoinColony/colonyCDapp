import React, { ReactNode } from 'react';

// import { CREATE_COLONY_ROUTE } from '~routes';

import { LEARN_MORE_PAYMENTS } from '~constants';
import { useActionSidebarContext } from '~context';
import { useColonyContext } from '~hooks';
import LearnMore from '~shared/Extensions/LearnMore';
import { formatText } from '~utils/intl';
import NavigationSidebar from '~v5/frame/NavigationSidebar';
import Button from '~v5/shared/Button';

import { useMainMenuItems } from './hooks';
import ColonySwitcherContent from './partials/ColonySwitcherContent';
import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { getChainIconName } from './utils';

const displayName = 'frame.Extensions.layouts.ColonyLayout.ColonySidebar';

interface Props {
  txButtons: ReactNode;
  userHub: ReactNode;
  transactionId?: string;
}

const ColonySidebar = ({ txButtons, userHub, transactionId }: Props) => {
  const mainMenuItems = useMainMenuItems(!!transactionId);
  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();
  const { colony } = useColonyContext();

  const { metadata, chainMetadata, colonyAddress = '' } = colony || {};
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
          colonyAddress,
        },
        content: {
          title: formatText({ id: 'navigation.colonySwitcher.title' }),
          content: <ColonySwitcherContent colony={colony} />,
          // bottomActionProps: {
          //   text: formatText({ id: 'button.createNewColony' }),
          //   iconName: 'plus',
          //   to: CREATE_COLONY_ROUTE,
          // },
        },
      }}
      mainMenuItems={mainMenuItems}
    />
  );
};

ColonySidebar.displayName = displayName;

export default ColonySidebar;
