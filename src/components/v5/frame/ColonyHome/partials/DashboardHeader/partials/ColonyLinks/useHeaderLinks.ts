import { CopySimple, Door, Rocket, ShareNetwork, Smiley } from 'phosphor-react';
import { useLocation } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext';
import { useColonyDashboardContext } from '~context/ColonyDashboardContext';
import { useMobile } from '~hooks';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { COLONY_DETAILS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import {
  DropdownMenuProps,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '~v5/common/DropdownMenu/types';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks';

import { sortExternalLinks } from './helpers';

export const useHeaderLinks = (): { dropdownMenuProps: DropdownMenuProps } => {
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

  const colonyUrl = `${window.location.host}${pathname}`;
  const { isWatching } = colonySubscription;
  const { colonyAddress, metadata } = colony || {};

  const externalLinks = metadata?.externalLinks
    ? sortExternalLinks(metadata.externalLinks)
    : [];

  const menuItems: DropdownMenuGroup[] = [
    {
      key: 'headerDropdown.section1',
      items: [
        {
          key: 'headerDropdown.section1.about',
          label: formatText({
            id: 'dashboard.burgerMenu.item.aboutColony',
          }),
          icon: Rocket,
          to: `/${colony?.name}/${COLONY_DETAILS_ROUTE}`,
        },
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
    // @BETA: Notifcations not implemented yet
    // {
    //   key: 'headerDropdown.section3',
    //   items: [
    //     {
    //       key: 'headerDropdown.section3.notifications',
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
