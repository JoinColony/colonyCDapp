// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

export const COLONY_HOME_ROUTE = '/colony/:colonyName/*';
export const COLONY_EVENTS_ROUTE = `/events`;
export const COLONY_DETAILS_ROUTE = `/colony/:colonyName/details`;
export const COLONY_ADMIN_ROUTE = `/colony/:colonyName/admin`;
export const COLONY_REPUTATION_ROUTE = `/colony/:colonyName/reputation`;
export const COLONY_PERMISSIONS_ROUTE = `/colony/:colonyName/permissions`;
export const COLONY_EXTENSIONS_ROUTE = `/colony/:colonyName/extensions`;
export const COLONY_INTEGRATIONS_ROUTE = `/colony/:colonyName/integrations`;
export const COLONY_INCORPORATION_ROUTE = `/colony/:colonyName/incorporation`;
export const COLONY_ADVANCED_ROUTE = `/colony/:colonyName/advanced`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `/colony/:colonyName/extensions/:extensionId/*`;
export const COLONY_EXTENSION_DETAILS_SETUP_ROUTE = `/colony/:colonyName/extensions/:extensionId/setup`;
export const COLONY_EXTENSION_SETUP_ROUTE = `/setup`;
export const COLONY_FUNDING_ROUTE = `colony/:colonyName/funds`;
export const COLONY_MEMBERS_ROUTE = `colony/:colonyName/members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `colony/:colonyName/members/:domainId`;
export const COLONY_CONTRIBUTORS_ROUTE = `colony/:colonyName/contributors`;
export const COLONY_FOLLOWERS_ROUTE = `colony/:colonyName/followers`;
export const COLONY_VERIFIED_ROUTE = `colony/:colonyName/verified`;
export const COLONY_TEAMS_ROUTE = `colony/:colonyName/teams`;
export const CREATE_COLONY_ROUTE = '/create-colony';
export const CREATE_USER_ROUTE = '/create-user';
export const USER_EDIT_ROUTE = '/edit-profile';
export const USER_ADVANCED_ROUTE = '/profile-advanced';
export const USER_PREFERENCES_ROUTE = '/profile-preferences';
export const USER_ROUTE = '/user/:username';
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/landing';
export const COLONY_DECISIONS_ROUTE = `/decisions`;
export const COLONY_DECISIONS_PREVIEW_ROUTE = `/colony/:colonyName/decisions/preview`;
export const DECISIONS_PAGE_ROUTE = `/colony/:colonyName/decisions/tx/:transactionHash`;
export const DECISIONS_PREVIEW_ROUTE_SUFFIX = '/preview';

// export const ACTIONS_PAGE_ROUTE = `${COLONY_HOME_ROUTE}/tx/:transactionHash`;
export const ACTIONS_PAGE_ROUTE = 'colony/:colonyName/tx/:transactionHash';
// export const UNWRAP_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/unwrap-tokens`;
// export const CLAIM_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/claim-tokens`;

export const TX_SEARCH_PARAM = 'tx';
