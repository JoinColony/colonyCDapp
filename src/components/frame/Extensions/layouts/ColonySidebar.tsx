import { Plus } from '@phosphor-icons/react';
import React, { type ReactNode } from 'react';

// import { CREATE_COLONY_ROUTE } from '~routes';

import { LEARN_MORE_PAYMENTS } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import LearnMore from '~shared/Extensions/LearnMore/index.ts';
import { formatText } from '~utils/intl.ts';
import NavigationSidebar from '~v5/frame/NavigationSidebar/index.ts';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks.ts';
import Button from '~v5/shared/Button/index.ts';

import { useMainMenuItems } from './hooks.tsx';
import ColonySwitcherContent from './partials/ColonySwitcherContent/index.ts';
import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';
import { getChainIcon } from './utils.ts';

const displayName = 'frame.Extensions.layouts.ColonyLayout.ColonySidebar';

interface Props {
  txButton: ReactNode;
  userHub: ReactNode;
  transactionId?: string;
}

const ColonySidebar = ({ txButton, userHub, transactionId }: Props) => {
  const { mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff: toggleOffMenu }] = mobileMenuToggle;
  const mainMenuItems = useMainMenuItems(!!transactionId);
  const { toggle } = useActionSidebarContext();
  const {
    colony: { name, metadata, chainMetadata, colonyAddress },
    colony,
  } = useColonyContext();
  const { chainId } = chainMetadata;

  const chainIcon = getChainIcon(chainId);

  return (
    <NavigationSidebar
      additionalMobileContent={
        <UserNavigationWrapper txButton={txButton} userHub={userHub} />
      }
      mobileBottomContent={
        <div className="flex w-full flex-col gap-6">
          <Button
            icon={Plus}
            className="w-full"
            onClick={() => {
              toggleOffMenu();
              toggle();
            }}
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
          size: 38,
          colonyImageSrc: metadata?.avatar
            ? metadata?.thumbnail || metadata?.avatar
            : undefined,
          chainIcon,
          colonyAddress,
          colonyName: metadata?.displayName || name,
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
