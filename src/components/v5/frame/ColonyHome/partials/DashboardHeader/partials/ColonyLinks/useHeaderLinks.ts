import {
  // @BETA: Disabled for now
  // BellRinging,
  CopySimple,
  DiscordLogo,
  Door,
  FacebookLogo,
  GithubLogo,
  Globe,
  IconProps,
  InstagramLogo,
  Rocket,
  Scroll,
  ShareNetwork,
  Smiley,
  TelegramLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'phosphor-react';
import { ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

import { useColonyDashboardContext } from '~context/ColonyDashboardContext';
import { ExternalLink, ExternalLinks } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import useMobile from '~hooks/useMobile';
import { COLONY_DETAILS_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from '~v5/common/DropdownMenu/types';
import { COLONY_LINK_CONFIG } from '~v5/shared/SocialLinks/colonyLinks';

import { ColonyLinksItem, ColonyLinksProps } from './types';

export const iconMappings: Record<ExternalLinks, ComponentType<IconProps>> = {
  [ExternalLinks.Custom]: Globe,
  [ExternalLinks.Whitepaper]: Scroll,
  [ExternalLinks.Github]: GithubLogo,
  [ExternalLinks.Discord]: DiscordLogo,
  [ExternalLinks.Twitter]: TwitterLogo,
  [ExternalLinks.Telegram]: TelegramLogo,
  [ExternalLinks.Youtube]: YoutubeLogo,
  [ExternalLinks.Facebook]: FacebookLogo,
  [ExternalLinks.Instagram]: InstagramLogo,
};

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

export const useHeaderLinks = (): ColonyLinksProps => {
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

  const items = metadata?.externalLinks
    ? getExternalLinks(metadata.externalLinks)
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
    items: [
      ...items.slice(0, 3),
      {
        key: 'share-url',
        icon: ShareNetwork,
        onClick: () => handleShareUrlItemCopy(colonyUrl),
        tooltipProps: {
          tooltipContent: formatText({
            id: 'colony.tooltip.url.copied',
          }),
          isOpen: isShareUrlItemCopied,
          isSuccess: true,
          placement: 'right',
        },
      },
    ],
    dropdownMenuProps: {
      groups: menuItems,
      showSubMenuInPopover: !isMobile,
    },
  };
};
