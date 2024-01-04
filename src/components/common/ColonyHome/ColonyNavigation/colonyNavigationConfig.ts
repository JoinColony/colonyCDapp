import { defineMessages } from 'react-intl';

import { MIN_VOTING_REPUTATION_VERSION_FOR_DECISIONS } from '~constants';
import { useColonyHomeContext } from '~context';
import {
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXPENDITURES_ROUTE,
  COLONY_DECISIONS_ROUTE,
} from '~routes';

import { NavItemProps as NavigationItem } from './NavItem';

export const displayName = 'common.ColonyHome.ColonyNavigation';

const MSG = defineMessages({
  linkTextActions: {
    id: `${displayName}.linkTextActions`,
    defaultMessage: 'Actions',
  },
  linkTextExtensions: {
    id: `${displayName}.linkTextExtensions`,
    defaultMessage: 'Extensions',
  },
  linkTextDecisions: {
    id: `${displayName}.linkTextDecisions`,
    defaultMessage: 'Decisions',
  },
  linkTextExpenditures: {
    id: `${displayName}.linkTextExpeditures`,
    defaultMessage: 'Expenditures',
  },
});

const useGetNavigationItems = (colonyName?: string) => {
  // These values are refetched whenever the governance extn is enabled/disabled
  const { isVotingReputationEnabled, votingReputationVersion } =
    useColonyHomeContext();

  if (!colonyName) {
    return [];
  }

  /*
   * @TODO actually determine these
   * This can be easily inferred from the subgraph queries
   *
   * But for that we need to store the "current" count either in redux or
   * in local storage... or maybe a local resolver?
   *
   * Problem is I couldn't get @client resolvers to work with subgrap queries :(
   */
  const hasNewActions = false;
  const hasNewExtensions = false;
  const hasNewDecisions = false;

  const navigationItems: NavigationItem[] = [
    {
      linkTo: `/${colonyName}`,
      showDot: hasNewActions,
      text: MSG.linkTextActions,
    },
    {
      linkTo: `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}`,
      showDot: hasNewExtensions,
      text: MSG.linkTextExtensions,
      dataTest: 'extensionsNavigationButton',
    },
    {
      linkTo: `/${colonyName}/${COLONY_EXPENDITURES_ROUTE}`,
      text: MSG.linkTextExpenditures,
      dataTest: 'expendituresNavigationButton',
    },
  ];

  const decisionsSupported =
    isVotingReputationEnabled &&
    (votingReputationVersion ?? 0) >=
      MIN_VOTING_REPUTATION_VERSION_FOR_DECISIONS;

  if (decisionsSupported) {
    navigationItems.splice(1, 0, {
      linkTo: `/${colonyName}/${COLONY_DECISIONS_ROUTE}`,
      showDot: hasNewDecisions,
      text: MSG.linkTextDecisions,
      dataTest: 'decisionsNavigationButton',
    });
  }

  return navigationItems;
};

export default useGetNavigationItems;
