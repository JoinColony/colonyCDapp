// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

// Also make sure that if you add a new base route, you add it to the `RESERVED_ROUTES` array at the bottom of this file
// so that users can't create colonies whose names clash with a base route. Also ensure no existing colony names clash with the proposed
// addition.

export const METACOLONY_HOME_ROUTE = '/meta';
// Colony rooutes
// @todo remove when going live
export const COLONY_OLD_HOME_ROUTE = '/old/:colonyName/*';
export const COLONY_HOME_ROUTE = ':colonyName/';
export const COLONY_DETAILS_ROUTE = `details`;
export const COLONY_ADMIN_ROUTE = `admin`;
export const COLONY_REPUTATION_ROUTE = `reputation`;
export const COLONY_PERMISSIONS_ROUTE = `permissions`;
export const COLONY_MULTISIG_ROUTE = `permissions/multisig`;
export const COLONY_EXTENSIONS_ROUTE = `extensions`;
export const COLONY_INTEGRATIONS_ROUTE = `integrations`;
export const COLONY_INCORPORATION_ROUTE = `incorporation`;
export const COLONY_ADVANCED_ROUTE = `advanced`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `${COLONY_EXTENSIONS_ROUTE}/:extensionId/*`;
export const COLONY_EXTENSION_SETUP_ROUTE = `setup`;
export const COLONY_EXTENSION_DETAILS_SETUP_ROUTE = `${COLONY_EXTENSIONS_ROUTE}/:extensionId/${COLONY_EXTENSION_SETUP_ROUTE}`;
export const COLONY_INCOMING_ROUTE = `incoming`;
export const COLONY_BALANCES_ROUTE = `balances`;
export const COLONY_MEMBERS_ROUTE = `members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `members/:domainId`;
export const COLONY_CONTRIBUTORS_ROUTE = `members/contributors`;
export const COLONY_VERIFIED_ROUTE = `verified`;
export const COLONY_TEAMS_ROUTE = `teams`;
export const COLONY_AGREEMENTS_ROUTE = `agreements`;
export const COLONY_DECISIONS_PREVIEW_ROUTE = `decisions/preview`;
export const COLONY_ACTIVITY_ROUTE = `activity`;
export const ACTIONS_PAGE_ROUTE = 'tx/:transactionHash';

export const ACTIONS_QUERY_STRING = '?tx=:transactionHash';

// User routes
export const USER_HOME_ROUTE = '/account';
export const USER_EDIT_PROFILE_ROUTE = 'profile';
export const USER_ADVANCED_ROUTE = 'advanced';
export const USER_PREFERENCES_ROUTE = 'preferences';

// UNUSED?
export const COLONY_EVENTS_ROUTE = `events`;
export const DECISIONS_PREVIEW_ROUTE_SUFFIX = '/preview';

export const CREATE_COLONY_ROUTE_BASE = '/create-colony';
export const CREATE_PROFILE_ROUTE = '/create-profile';
export const CREATE_COLONY_ROUTE = `${CREATE_COLONY_ROUTE_BASE}/:inviteCode`;
export const USER_INVITE_ROUTE = `/invite/:colonyName/:inviteCode`;
export const COLONY_SPLASH_ROUTE = `/go/:colonyName`;
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/';

export const TX_SEARCH_PARAM = 'tx';
export const TEAM_SEARCH_PARAM = 'team';
