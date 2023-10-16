// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

// Colony rooutes
export const COLONY_HOME_ROUTE = '/colony/:colonyName/*';
// @todo remove when going live
export const COLONY_OLD_HOME_ROUTE = '/old/:colonyName/*';
export const COLONY_DETAILS_ROUTE = `details`;
export const COLONY_ADMIN_ROUTE = `admin`;
export const COLONY_REPUTATION_ROUTE = `reputation`;
export const COLONY_PERMISSIONS_ROUTE = `permissions`;
export const COLONY_EXTENSIONS_ROUTE = `extensions`;
export const COLONY_INTEGRATIONS_ROUTE = `integrations`;
export const COLONY_INCORPORATION_ROUTE = `incorporation`;
export const COLONY_ADVANCED_ROUTE = `advanced`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `extensions/:extensionId/*`;
export const COLONY_EXTENSION_DETAILS_SETUP_ROUTE = `extensions/:extensionId/setup`;
export const COLONY_FUNDING_ROUTE = `funds`;
export const COLONY_MEMBERS_ROUTE = `members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `members/:domainId`;
export const COLONY_CONTRIBUTORS_ROUTE = `contributors`;
export const COLONY_FOLLOWERS_ROUTE = `followers`;
export const COLONY_VERIFIED_ROUTE = `verified`;
export const COLONY_BALANCE_ROUTE = `balance`;
export const COLONY_TEAMS_ROUTE = `teams`;
export const COLONY_DECISIONS_PREVIEW_ROUTE = `decisions/preview`;
export const DECISIONS_PAGE_ROUTE = `decisions/tx/:transactionHash`;
export const ACTIONS_PAGE_ROUTE = 'tx/:transactionHash';
export const COLONY_ACTIVITY_ROUTE = `activity`;

export const COLONY_EXTENSION_SETUP_ROUTE = `setup`;

// User routes
export const USER_HOME_ROUTE = '/my';
export const USER_EDIT_PROFILE_ROUTE = 'profile';
export const USER_ADVANCED_ROUTE = 'advanced-settings';
export const USER_PREFERENCES_ROUTE = 'preferences';

// UNUSED?
export const COLONY_EVENTS_ROUTE = `/events`;
export const DECISIONS_PREVIEW_ROUTE_SUFFIX = '/preview';

export const CREATE_COLONY_ROUTE_BASE = '/create-colony';
export const CREATE_COLONY_ROUTE = `${CREATE_COLONY_ROUTE_BASE}/:inviteCode`;
export const CREATE_USER_ROUTE = '/create-user';
export const USER_ROUTE = '/user/:username';
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/landing';
export const COLONY_DECISIONS_ROUTE = `/decisions`;

// export const ACTIONS_PAGE_ROUTE = `${COLONY_HOME_ROUTE}/tx/:transactionHash`;
// export const UNWRAP_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/unwrap-tokens`;
// export const CLAIM_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/claim-tokens`;

export const TX_SEARCH_PARAM = 'tx';
