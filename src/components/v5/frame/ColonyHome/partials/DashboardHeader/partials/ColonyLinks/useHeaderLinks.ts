import { CopySimple, Door, ShareNetwork, Smiley } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

import { APP_URL } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyDashboardContext } from '~context/ColonyDashboardContext/ColonyDashboardContext.ts';
import { useNotificationsUserContext } from '~context/Notifications/NotificationsUserContext/NotificationsUserContext.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import {
  type DropdownMenuProps,
  type DropdownMenuGroup,
  type DropdownMenuItem,
} from '~v5/common/DropdownMenu/types.ts';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks.ts';

import { sortExternalLinks } from './helpers.ts';
import { useMuteColonyItem } from './useMuteColonyItem.ts';

export const useHeaderLinks = (): { dropdownMenuProps: DropdownMenuProps } => {
  const { areNotificationsEnabled } = useNotificationsUserContext();
  const isMobile = useMobile();

  const { colony, colonySubscription } = useColonyContext();
  const { pathname } = useLocation();
  const { openLeaveColonyModal } = useColonyDashboardContext();

  const {
    handleClipboardCopy: handleShareUrlItemCopy,
    isCopied: isShareUrlItemCopied,
  } = useCopyToClipboard(5000);
  const {
    handleClipboardCopy: handleColonyAddressItemCopy,
    isCopied: isColonyAddressItemCopied,
  } = useCopyToClipboard(5000);

  const colonyUrl = `${APP_URL.host}${pathname}`;
  const { isWatching } = colonySubscription;
  const { colonyAddress, metadata } = colony || {};

  const externalLinks = metadata?.externalLinks
    ? sortExternalLinks(metadata.externalLinks)
    : [];

  const toggleMuteColonyItem = useMuteColonyItem();

  const menuItems: DropdownMenuGroup[] = [
    {
      key: 'headerDropdown.section1',
      items: [
        {
          key: 'colonyData.section1.copyAddress',
          label: formatText({ id: 'dashboard.burgerMenu.item.colonyAddress' }),
          icon: CopySimple,
          onClick: () => handleColonyAddressItemCopy(colonyAddress ?? ''),
          tooltipProps: {
            tooltipContent: formatText({
              id: 'colony.tooltip.colonyAddress.copied',
            }),
            isOpen: isColonyAddressItemCopied,
            isSuccess: true,
          },
        },
      ],
    },
    {
      key: 'headerDropdown.section2',
      items: [
        ...(externalLinks.length
          ? [
              {
                key: 'headerDropdown.section2.externalLinks',
                label: formatText({
                  id: 'dashboard.burgerMenu.item.externalLinks',
                }),
                icon: Smiley,
                items: externalLinks.map<DropdownMenuItem>(
                  ({ link, name }) => ({
                    key: name,
                    label: COLONY_LINK_CONFIG[name].label || '',
                    icon: COLONY_LINK_CONFIG[name].LinkIcon,
                    to: link,
                  }),
                ),
              },
            ]
          : []),
        {
          key: 'headerDropdown.section2.copyUrl',
          label: formatText({ id: 'dashboard.burgerMenu.item.share' }),
          icon: ShareNetwork,
          onClick: () => handleShareUrlItemCopy(colonyUrl),
          tooltipProps: {
            tooltipContent: formatText({
              id: 'colony.tooltip.url.copied',
            }),
            isOpen: isShareUrlItemCopied,
            isSuccess: true,
          },
        },
      ],
    },
    ...(areNotificationsEnabled
      ? [
          {
            key: 'headerDropdown.section3',
            items: [toggleMuteColonyItem],
          },
        ]
      : []),
    {
      key: 'headerDropdown.section4',
      items: isWatching
        ? [
            {
              key: 'headerDropdown.section4.leaveColony',
              label: formatText({
                id: 'dashboard.burgerMenu.item.leaveColony',
              }),
              icon: Door,
              onClick: () => openLeaveColonyModal(),
            },
          ]
        : [],
    },
  ].filter((menuItem) => menuItem.items.length !== 0);

  return {
    dropdownMenuProps: {
      groups: menuItems,
      showSubMenuInPopover: !isMobile,
    },
  };
};
