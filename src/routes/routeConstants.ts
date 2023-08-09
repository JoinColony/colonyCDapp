// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

export const COLONY_HOME_ROUTE = '/colony/:colonyName/*';
export const COLONY_EVENTS_ROUTE = `/events`;
export const COLONY_EXTENSIONS_ROUTE = `/extensions`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `/extensions/:extensionId/*`;
export const COLONY_EXTENSION_SETUP_ROUTE = `/setup`;
export const COLONY_FUNDING_ROUTE = `colony/:colonyName/funds`;
export const COLONY_MEMBERS_ROUTE = `colony/:colonyName/members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `colony/:colonyName/members/:domainId`;
export const CREATE_COLONY_ROUTE = '/create-colony';
export const CREATE_USER_ROUTE = '/create-user';
export const USER_EDIT_ROUTE = '/edit-profile';
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
