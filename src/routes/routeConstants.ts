// @NOTE: While adding or modifying a route here make sure you
// also modify the document title hook at src/utils/hooks/useTitle.ts

export const COLONY_HOME_ROUTE = '/colony/:colonyName/*';
export const COLONY_EVENTS_ROUTE = `/events`;
export const COLONY_DETAILS_ROUTE = `/colony/:colonyName/details`;
export const COLONY_REPUTATION_ROUTE = `/colony/:colonyName/reputation`;
export const COLONY_PERMISSIONS_ROUTE = `/colony/:colonyName/permissions`;
export const COLONY_EXTENSIONS_ROUTE = `/colony/:colonyName/extensions`;
export const COLONY_INTEGRATIONS_ROUTE = `/colony/:colonyName/integrations`;
export const COLONY_INCORPORATION_ROUTE = `/colony/:colonyName/incorporations`;
export const COLONY_ADVANCED_ROUTE = `/colony/:colonyName/advanced`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `/colony/:colonyName/extensions/:extensionId/*`;
export const COLONY_EXTENSION_SETUP_ROUTE = `/setup`;
export const COLONY_FUNDING_ROUTE = `colony/:colonyName/funds`;
export const COLONY_MEMBERS_ROUTE = `colony/:colonyName/members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `colony/:colonyName/members/:domainId`;
export const CREATE_COLONY_ROUTE = '/create-colony';
export const CREATE_USER_ROUTE = '/create-user';
export const USER_EDIT_ROUTE = '/edit-profile';
export const USER_ROUTE = '/user/:usernameOrAddress';
export const NOT_FOUND_ROUTE = '/404';
export const LANDING_PAGE_ROUTE = '/landing';
export const ACTIONS_PAGE_ROUTE = 'colony/:colonyName/tx/:transactionHash';
// export const UNWRAP_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/unwrap-tokens`;
// export const CLAIM_TOKEN_ROUTE = `${COLONY_HOME_ROUTE}/claim-tokens`;
