import { Plus } from '@phosphor-icons/react';
import React, { type ReactNode } from 'react';

// import { CREATE_COLONY_ROUTE } from '~routes';

import { LEARN_MORE_PAYMENTS } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import LearnMore from '~shared/Extensions/LearnMore/index.ts';
import { formatText } from '~utils/intl.ts';
import NavigationSidebar from '~v5/frame/NavigationSidebar/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { useMainMenuItems } from './hooks.tsx';
import ColonySwitcherContent from './partials/ColonySwitcherContent/index.ts';
import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';
import { getChainIcon } from './utils.ts';

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
  const {
    colony: { metadata, chainMetadata, colonyAddress },
    colony,
  } = useColonyContext();
  const { chainId } = chainMetadata;

  const chainIcon = getChainIcon(chainId);

  return (
    <NavigationSidebar
      additionalMobileContent={
        <UserNavigationWrapper txButtons={txButtons} userHub={userHub} />
      }
      mobileBottomContent={
        <div className="flex w-full flex-col gap-6">
          <Button
            icon={Plus}
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
          chainIcon,
          colonyAddress,
        },
        content: {
          title: formatText({ id: 'navigation.colonySwitcher.title' }),
          content: <ColonySwitcherContent colony={colony} />,
          // bottomActionProps: {
          //   text: formatText({ id: 'button.createNewColony' }),
          //   icon={Plus}
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
