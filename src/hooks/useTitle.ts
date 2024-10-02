// When called without an argument (from `Routes.tsx`) this hook
// parses the window location URL to set the title. If called
// with an argument `title` (from any component), it sets the
// document title to `title` - this might be especially useful
// when you want to manipulate the title even when the route
// remains same (for example, when multiple dialogue boxes can
// be present on the same route.)

import { defineMessages, useIntl, type MessageDescriptor } from 'react-intl';
import { useLocation, matchPath } from 'react-router-dom';

import { useGetDisplayNameByColonyNameQuery } from '~gql';
import {
  CREATE_COLONY_ROUTE,
  CREATE_PROFILE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  NOT_FOUND_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_EVENTS_ROUTE,
  ACTIONS_QUERY_STRING,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_MEMBERS_ROUTE,
  USER_HOME_ROUTE,
  USER_PREFERENCES_ROUTE,
  USER_ADVANCED_ROUTE,
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_TEAMS_ROUTE,
  COLONY_VERIFIED_ROUTE,
  COLONY_DETAILS_ROUTE,
  COLONY_REPUTATION_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
  COLONY_INTEGRATIONS_ROUTE,
  COLONY_INCORPORATION_ROUTE,
  COLONY_ADVANCED_ROUTE,
  COLONY_BALANCES_ROUTE,
  COLONY_MULTISIG_ROUTE,
} from '~routes/routeConstants.ts';
import { type SimpleMessageValues } from '~types/index.ts';
import { notNull } from '~utils/arrays/index.ts';

const displayName = 'utils.hooks';

const MSG = defineMessages({
  createColony: {
    id: `${displayName}.useTitle.createColony`,
    defaultMessage: `Create a Colony | Colony`,
  },

  createUser: {
    id: `${displayName}.useTitle.createUser`,
    defaultMessage: `Create a User | Colony`,
  },

  createProfile: {
    id: `${displayName}.useTitle.createProfile`,
    defaultMessage: `Create a Profile | Colony`,
  },

  editProfile: {
    id: `${displayName}.useTitle.editProfile`,
    defaultMessage: `Account Profile | Colony`,
  },

  editPreferences: {
    id: `${displayName}.useTitle.editPreferences`,
    defaultMessage: `Account Preferences | Colony`,
  },

  advancedSettings: {
    id: `${displayName}.useTitle.advancedSettings`,
    defaultMessage: `Advanced Settings | Colony`,
  },

  notFound: {
    id: `${displayName}.useTitle.notFound`,
    defaultMessage: `404 - Not Found | Colony`,
  },

  landing: {
    id: `${displayName}.useTitle.landing`,
    defaultMessage: `Welcome to Colony`,
  },

  colonyHome: {
    id: `${displayName}.useTitle.colonyHome`,
    defaultMessage: `{colonyName} | Colony`,
  },

  colonyEvents: {
    id: `${displayName}.useTitle.colonyEvents`,
    defaultMessage: `Transactions Log | Colony - {colonyName}`,
  },

  colonyIncoming: {
    id: `${displayName}.useTitle.colonyIncoming`,
    defaultMessage: `Incoming | Colony - {colonyName}`,
  },

  colonyBalances: {
    id: `${displayName}.useTitle.colonyBalances`,
    defaultMessage: `Balances | Colony - {colonyName}`,
  },

  colonyExtensions: {
    id: `${displayName}.useTitle.colonyExtensions`,
    defaultMessage: `Extensions | Colony - {colonyName}`,
  },

  colonyExtensionDetails: {
    id: `${displayName}.useTitle.colonyExtensionDetails`,
    defaultMessage: `{extensionId, select,
      VotingReputation {Governance}
      OneTxPayment {One Transaction Payment}
      StakedExpenditure {Staked Expenditure}
      StagedExpenditure {Staged Expenditure}
      StreamingPayments {Streaming Payments}
      other {{extensionId}}
      } Extension | Colony - {colonyName}`,
  },

  colonyMembers: {
    id: `${displayName}.useTitle.colonyMembers`,
    defaultMessage: `Members | Colony - {colonyName}`,
  },

  colonyContributors: {
    id: `${displayName}.useTitle.colonyContributors`,
    defaultMessage: `Contributors | Colony - {colonyName}`,
  },

  colonyVerified: {
    id: `${displayName}.useTitle.colonyVerified`,
    defaultMessage: `Verified Members | Colony - {colonyName}`,
  },

  colonyTeams: {
    id: `${displayName}.useTitle.colonyTeams`,
    defaultMessage: `Teams | Colony - {colonyName}`,
  },

  colonyDetails: {
    id: `${displayName}.useTitle.colonyDetails`,
    defaultMessage: `Details | Colony - {colonyName}`,
  },

  colonyReputation: {
    id: `${displayName}.useTitle.colonyReputation`,
    defaultMessage: `Reputation | Colony - {colonyName}`,
  },

  colonyPermissions: {
    id: `${displayName}.useTitle.colonyPermissions`,
    defaultMessage: `Permissions | Colony - {colonyName}`,
  },

  colonyIntegrations: {
    id: `${displayName}.useTitle.colonyIntegrations`,
    defaultMessage: `Integrations | Colony - {colonyName}`,
  },

  colonyIncorporation: {
    id: `${displayName}.useTitle.colonyIncorporation`,
    defaultMessage: `Incorporation | Colony - {colonyName}`,
  },

  colonyAdvanced: {
    id: `${displayName}.useTitle.colonyAdvanced`,
    defaultMessage: `Advanced Settings | Colony`,
  },

  transactionDetails: {
    id: `${displayName}.useTitle.transactionDetails`,
    defaultMessage: `Transaction - {transactionHash} | Colony`,
  },

  buyTokens: {
    id: `${displayName}.useTitle.buyTokens`,
    defaultMessage: `Buy Tokens | Colony - {colonyName}`,
  },
  fallbackTitle: {
    id: `${displayName}.useTitle.fallbackTitle`,
    defaultMessage: `Colony App`,
  },
});

interface MessageWithValues {
  msg: MessageDescriptor;
  values?: SimpleMessageValues;
}

const routeMessages: Record<string, MessageDescriptor> = {
  [`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`]: MSG.editProfile,
  [`${USER_HOME_ROUTE}/${USER_PREFERENCES_ROUTE}`]: MSG.editPreferences,
  [`${USER_HOME_ROUTE}/${USER_ADVANCED_ROUTE}`]: MSG.advancedSettings,

  '/': MSG.landing,
  [COLONY_HOME_ROUTE]: MSG.colonyHome,
  [`${COLONY_HOME_ROUTE}${COLONY_EVENTS_ROUTE}`]: MSG.colonyEvents,
  [`${COLONY_HOME_ROUTE}${COLONY_INCOMING_ROUTE}`]: MSG.colonyIncoming,
  [`${COLONY_HOME_ROUTE}${COLONY_EXTENSIONS_ROUTE}`]: MSG.colonyExtensions,
  [`${COLONY_HOME_ROUTE}${COLONY_EXTENSION_DETAILS_ROUTE}`]:
    MSG.colonyExtensionDetails,
  [ACTIONS_QUERY_STRING]: MSG.transactionDetails,
  [`${COLONY_HOME_ROUTE}${COLONY_MEMBERS_ROUTE}`]: MSG.colonyMembers,
  [`${COLONY_HOME_ROUTE}${COLONY_CONTRIBUTORS_ROUTE}`]: MSG.colonyContributors,
  [`${COLONY_HOME_ROUTE}${COLONY_BALANCES_ROUTE}`]: MSG.colonyBalances,
  [`${COLONY_HOME_ROUTE}${COLONY_VERIFIED_ROUTE}`]: MSG.colonyVerified,
  [`${COLONY_HOME_ROUTE}${COLONY_TEAMS_ROUTE}`]: MSG.colonyTeams,
  [`${COLONY_HOME_ROUTE}${COLONY_DETAILS_ROUTE}`]: MSG.colonyDetails,
  [`${COLONY_HOME_ROUTE}${COLONY_REPUTATION_ROUTE}`]: MSG.colonyReputation,
  [`${COLONY_HOME_ROUTE}${COLONY_PERMISSIONS_ROUTE}`]: MSG.colonyPermissions,
  [`${COLONY_HOME_ROUTE}${COLONY_MULTISIG_ROUTE}`]: MSG.colonyPermissions,
  [`${COLONY_HOME_ROUTE}${COLONY_INTEGRATIONS_ROUTE}`]: MSG.colonyIntegrations,
  [`${COLONY_HOME_ROUTE}${COLONY_INCORPORATION_ROUTE}`]:
    MSG.colonyIncorporation,
  [`${COLONY_HOME_ROUTE}${COLONY_ADVANCED_ROUTE}`]: MSG.colonyAdvanced,

  /* NOTE: All routes should be added at the bottom to avoid being
   * clobbered by the COLONY_HOME_ROUTE */
  [NOT_FOUND_ROUTE]: MSG.notFound,
  [CREATE_COLONY_ROUTE]: MSG.createColony,
  [CREATE_PROFILE_ROUTE]: MSG.createProfile,
};

const allRoutes = Object.keys(routeMessages);

const getMessageAndValues = (
  locationPath: string,
  search: string,
): MessageWithValues => {
  // If route includes tx search query
  if (search && /\?tx=[a-zA-F0-9]{66}/.test(search)) {
    return {
      msg: routeMessages[ACTIONS_QUERY_STRING],
      values: { transactionHash: search.split('=')[1] },
    };
  }
  const filteredRoutes = allRoutes.filter((routePattern) =>
    notNull(matchPath(routePattern, locationPath)),
  );

  // Fallback when no route matches
  // For example before an invalid route get redirected to 404
  const matchedRoute = filteredRoutes.at(-1) ?? '';
  const values = matchPath(matchedRoute, locationPath)?.params; // this can be empty {}

  return { msg: routeMessages[matchedRoute] ?? MSG.fallbackTitle, values };
};

export const useTitle = (title?: string) => {
  const { pathname, search } = useLocation();
  const { formatMessage } = useIntl();
  const { msg, values } = getMessageAndValues(pathname, search);

  const colonyENSName = (values?.colonyName as string) ?? '';

  const { data, error } = useGetDisplayNameByColonyNameQuery({
    variables: { name: colonyENSName },
    skip: colonyENSName === '',
  });

  if (error) {
    console.error(error);
  }

  const queryDisplayName =
    data?.getColonyByName?.items?.[0]?.metadata?.displayName;

  const colonyDisplayName = queryDisplayName || colonyENSName;
  const titleToSet =
    title ||
    formatMessage(msg, {
      ...values,
      colonyName: colonyDisplayName,
    });

  // @TODO: maybe use a more react-y way to set the title (like react helmet or hoofd)
  document.title = titleToSet;
};

export default useTitle;
