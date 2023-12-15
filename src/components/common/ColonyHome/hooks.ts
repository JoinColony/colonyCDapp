import { useMemo, useState } from 'react';
import { Id } from '@colony/colony-js';
import {
  // @BETA: Disabled for now
  // BellRinging,
  Door,
  Rocket,
  ShareNetwork,
  Smiley,
} from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

import { useGetTotalColonyActionsQuery } from '~gql';
import { useColonyContext, useMobile } from '~hooks';
import { notNull } from '~utils/arrays';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { formatText } from '~utils/intl';
import {
  setHexTeamColor,
  setTeamColor,
} from '~v5/common/TeamReputationSummary/utils';
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
import { createBaseActionFilter } from '~hooks/useActivityFeed/helpers';
import { useMemberContext } from '~context/MemberContext';

import { iconMappings, MAX_TEXT_LENGTH } from './consts';
import { ChartData, UseGetHomeWidgetReturnType } from './types';

export const useGetHomeWidget = (team?: number): UseGetHomeWidgetReturnType => {
  const { colony } = useColonyContext();
  const { domains, nativeToken, colonyAddress = '' } = colony || {};
  const { balances } = colony || {};

  const { totalMembers: members, loading: membersLoading } = useMemberContext();

  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const currentTokenBalance =
    getBalanceForTokenAndDomain(
      balances,
      nativeToken?.tokenAddress || '',
      team,
    ) || 0;

  const domainMembers = useMemo(
    () =>
      team
        ? members.filter(
            ({ roles, reputation }) =>
              roles?.items?.find((role) => role?.domain.nativeId === team) ||
              reputation?.items?.find((rep) => rep?.domain.nativeId === team),
          )
        : members,
    [members, team],
  );

  const { data: totalActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        ...createBaseActionFilter(colonyAddress),
      },
    },
  });

  const totalActions = totalActionData?.searchColonyActions?.total ?? 0;

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === team,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);
  const mappedMembers = useMemo(
    () =>
      domainMembers
        .filter(
          (member, index, self) =>
            index ===
            self.findIndex(
              (m) => m.contributorAddress === member.contributorAddress,
            ),
        )
        .map((member) => ({
          walletAddress: member.contributorAddress,
          ...member.user,
        }))
        .sort(() => Math.random() - 0.5),
    [domainMembers],
  );

  const allTeams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const otherTeamsReputation = allTeams
    ?.slice(3, allTeams.length)
    .filter((item) => item.reputationPercentage !== null)
    .reduce((acc, item) => acc + Number(item.reputationPercentage), 0);

  const otherTeams = {
    id: '4',
    label: formatText({ id: 'label.allOther' }),
    value: otherTeamsReputation ?? 0,
    color: '--color-teams-grey-100',
    stroke: '--color-teams-grey-100',
  };

  const firstThreeTeams = allTeams?.length
    ? allTeams
        .map(({ id, metadata, reputationPercentage }) => {
          return {
            id,
            label: metadata?.name || '',
            value: Number(reputationPercentage),
            color: setHexTeamColor(metadata?.color),
            stroke: setHexTeamColor(metadata?.color),
          };
        })
        .slice(0, 3)
    : [];

  const chartData = allTeams?.length ? [...firstThreeTeams, otherTeams] : [];

  return {
    totalActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
    chartData,
    allTeams,
    otherTeamsReputation,
    hoveredSegment,
    setHoveredSegment,
  };
};

export const useExternalLinks = (): ColonyLinksItem[] => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const { externalLinks } = metadata || {};
  const linksPriority = Object.keys(iconMappings);

  const sortedLinks = [...(externalLinks || [])]?.sort(
    (x, y) => linksPriority.indexOf(x.name) - linksPriority.indexOf(y.name),
  );

  return sortedLinks.map(({ name, link }) => ({
    key: name,
    icon: iconMappings[name],
    to: link,
  }));
};

export const useDashboardHeader = (): ColonyDashboardHeaderProps => {
  const { colony, colonySubscription } = useColonyContext();
  const items = useExternalLinks();
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

  const truncatedText =
    description.length > MAX_TEXT_LENGTH
      ? `${description.slice(0, MAX_TEXT_LENGTH - 3)}...`
      : description;

  const menuItems: DropdownMenuGroup[] = useMemo(
    () =>
      [
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
      ].filter((menuItem) => menuItem.items.length !== 0),
    [
      colony?.name,
      colonyUrl,
      isWatching,
      itemHandleClipboardCopy,
      itemIsCopied,
      items,
    ],
  );

  return {
    colonyName: metadata?.displayName || '',
    description: truncatedText,
    tokenName: currentToken?.token.symbol || '',
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
