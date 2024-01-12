import { CopySimple, Door, Rocket, ShareNetwork, Smiley } from 'phosphor-react';
import { useLocation } from 'react-router-dom';

import { useColonyDashboardContext } from '~context/ColonyDashboardContext';
import useColonyContext from '~hooks/useColonyContext';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import useMobile from '~hooks/useMobile';
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
  const isMobile = useMobile()

  const { colony, colonySubscription } = useColonyContext();
  const { pathname } = useLocation();
  const colonyUrl = `${window.location.host}${pathname}`;
  const {
    handleClipboardCopy: handleShareUrlItemCopy,
    isCopied: isShareUrlItemCopied,
  } = useCopyToClipboard(5000);
  const {
    handleClipboardCopy: handleColonyAddressItemCopy,
    isCopied: isColonyAddressItemCopied,
  } = useCopyToClipboard(5000);
  const { openLeaveColonyModal } = useColonyDashboardContext();

  const { isWatching } = colonySubscription;
  const { metadata } = colony || {};

  const externalLinks = metadata?.externalLinks
    ? sortExternalLinks(metadata.externalLinks)
    : [];

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
        {
          key: '1.2',
          label: formatText({ id: 'dashboard.burgerMenu.item.colonyAddress' }),
          icon: CopySimple,
          onClick: () => handleColonyAddressItemCopy(colony?.colonyAddress  ?? ''),
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
      key: '2',
      items: [
        ...(externalLinks.length
          ? [
              {
                key: '2.1',
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
          key: '2.2',
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
