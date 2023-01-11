import { defineMessages } from 'react-intl';

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
});

const getNavigationItems = (colonyName?: string) => {
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

  const navigationItems: NavigationItem[] = [
    {
      linkTo: `/colony/${colonyName}`,
      showDot: hasNewActions,
      text: MSG.linkTextActions,
    },
    {
      linkTo: `/colony/${colonyName}/extensions`,
      showDot: hasNewExtensions,
      text: MSG.linkTextExtensions,
      dataTest: 'extensionsNavigationButton',
    },
  ];

  // @TODO -> Requires extensions
  /* const decisionsSupported =   
      isVotingExtensionEnabled &&
      votingExtensionVersion &&
      votingExtensionVersion >= VotingReputationExtensionVersion.GreenLightweightSpaceship;
  */

  // if (decisionsSupported) {
  navigationItems.splice(1, 0, {
    linkTo: `/colony/${colonyName}/decisions`,
    // showDot: hasNewDecisions,
    text: MSG.linkTextDecisions,
    dataTest: 'decisionsNavigationButton',
  });
  // }

  return navigationItems;
};

export default getNavigationItems;
