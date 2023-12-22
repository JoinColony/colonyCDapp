import { useState } from 'react';
import {
  // @BETA: Disabled for now
  // BellRinging,
  Door,
  Rocket,
  ShareNetwork,
  Smiley,
} from 'phosphor-react';
import { useLocation } from 'react-router-dom';

import { useColonyContext, useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import { ColonyDashboardHeaderProps } from '~v5/common/ColonyDashboardHeader/types';
import { getCurrentToken } from '~common/ColonyTotalFunds/SelectedToken/helpers';
import { ColonyLinksItem } from '~v5/common/ColonyDashboardHeader/partials/ColonyLinks/types';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from '~v5/common/DropdownMenu/types';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { COLONY_DETAILS_ROUTE } from '~routes/routeConstants';
import { iconMappings, MAX_TEXT_LENGTH } from './consts';
import { ExternalLink } from '~gql';

const getExternalLinks = (externalLinks: ExternalLink[]): ColonyLinksItem[] => {
  const linksPriority = Object.keys(iconMappings);

  const sortedLinks = [...(externalLinks || [])]?.sort(
    (link1, link2) =>
      linksPriority.indexOf(link1.name) - linksPriority.indexOf(link2.name),
  );

  return sortedLinks.map(({ name, link }) => ({
    key: name,
    icon: iconMappings[name],
    to: link,
  }));
};

export const useDashboardHeader = (): ColonyDashboardHeaderProps => {
  const { colony, colonySubscription } = useColonyContext();
  const { pathname } = useLocation();
  const colonyUrl = `${window.location.host}${pathname}`;
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(5000);
  const {
    handleClipboardCopy: itemHandleClipboardCopy,
    isCopied: itemIsCopied,
  } = useCopyToClipboard(5000);
  const [leaveColonyConfirmOpen, setLeaveColonyConfirm] =
    useState<boolean>(false);
  const isMobile = useMobile();
  const { isWatching } = colonySubscription;

  const { tokens, nativeToken } = colony || {};
  const { tokenAddress: nativeTokenAddress } = nativeToken || {};
  const currentToken = getCurrentToken(tokens, nativeTokenAddress ?? '');
  const isNativeTokenUnlocked = !!colony?.status?.nativeToken?.unlocked;

  const { metadata } = colony || {};
  const description =
    metadata?.description || formatText({ id: 'colony.description' });
  const items = metadata?.externalLinks
    ? getExternalLinks(metadata.externalLinks)
    : [];

  const truncatedText =
    description.length > MAX_TEXT_LENGTH
      ? `${description.slice(0, MAX_TEXT_LENGTH - 3)}...`
      : description;

  const menuItems: DropdownMenuGroup[] = [
    {
      key: '1',
      items: [
        {
          key: '1.1',
          label: formatText({
            id: 'dashboard.burgerMenu.item.aboutColony',
          }),
          icon: Rocket,
          to: `/${colony?.name}/${COLONY_DETAILS_ROUTE}`,
        },
      ],
    },
    {
      key: '2',
      items: [
        ...(items.length
          ? [
              {
                key: '2.1',
                label: formatText({
                  id: 'dashboard.burgerMenu.item.externalLinks',
                }),
                icon: Smiley,
                items: items.map<DropdownMenuItem>(({ key, ...item }) => ({
                  ...item,
                  key,
                  label: COLONY_LINK_CONFIG[key].label,
                })),
              },
            ]
          : []),
        {
          key: '2.2',
          label: formatText({ id: 'dashboard.burgerMenu.item.share' }),
          icon: ShareNetwork,
          onClick: () => itemHandleClipboardCopy(colonyUrl),
          tooltipProps: {
            tooltipContent: formatText({
              id: 'colony.tooltip.url.copied',
            }),
            isOpen: itemIsCopied,
            isSuccess: true,
          },
        },
      ],
    },
    // @BETA: Notifcations not implemented yet
    // {
    //   key: '3',
    //   items: [
    //     {
    //       key: '3.1',
    //       label: formatText({
    //         id: 'dashboard.burgerMenu.item.notifications',
    //       }),
    //       icon: BellRinging,
    //       // @TODO: open Notification tab when will be ready
    //       onClick: () => {},
    //     },
    //   ],
    // },
    {
      key: '4',
      items: isWatching
        ? [
            {
              key: '4.1',
              label: formatText({
                id: 'dashboard.burgerMenu.item.leaveColony',
              }),
              icon: Door,
              onClick: () => setLeaveColonyConfirm(true),
            },
          ]
        : [],
    },
  ].filter((menuItem) => menuItem.items.length !== 0);

  return {
    colonyName: metadata?.displayName || '',
    description: truncatedText,
    token: currentToken?.token,
    isTokenUnlocked: isNativeTokenUnlocked,
    colonyLinksProps: {
      items: [
        ...items.slice(0, 3),
        {
          key: 'share-url',
          icon: ShareNetwork,
          onClick: () => handleClipboardCopy(colonyUrl),
          tooltipProps: {
            tooltipContent: formatText({
              id: 'colony.tooltip.url.copied',
            }),
            isOpen: isCopied,
            isSuccess: true,
            placement: 'right',
          },
        },
      ],
      dropdownMenuProps: {
        groups: menuItems,
        showSubMenuInPopover: !isMobile,
      },
    },
    leaveColonyConfirmOpen,
    setLeaveColonyConfirm,
  };
};
