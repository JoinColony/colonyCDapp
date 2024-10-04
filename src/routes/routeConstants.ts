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
export const COLONY_ADMIN_ROUTE = `admin`;
export const COLONY_REPUTATION_ROUTE = `reputation`;

export const COLONY_PERMISSIONS_ROUTE = `permissions`;
export const COLONY_PERMISSIONS_MULTISIG_SECTION = 'multisig';
export const COLONY_MULTISIG_ROUTE = `${COLONY_PERMISSIONS_ROUTE}/${COLONY_PERMISSIONS_MULTISIG_SECTION}`;

export const COLONY_EXTENSIONS_ROUTE = `extensions`;
export const COLONY_INTEGRATIONS_ROUTE = `integrations`;
export const COLONY_INCORPORATION_ROUTE = `incorporation`;
export const COLONY_ADVANCED_ROUTE = `advanced`;
export const COLONY_EXTENSION_DETAILS_ROUTE = `${COLONY_EXTENSIONS_ROUTE}/:extensionId`;
export const COLONY_INCOMING_ROUTE = `incoming`;
export const COLONY_BALANCES_ROUTE = `balances`;
export const COLONY_FOLLOWERS_ROUTE = `members/followers`;
export const COLONY_STREAMING_PAYMENTS_ROUTE = `streaming-payments`;
export const COLONY_MEMBERS_ROUTE = `members`;
export const COLONY_MEMBERS_WITH_DOMAIN_ROUTE = `members/:domainId`;
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
export const USER_CRYPTO_TO_FIAT_ROUTE = 'crypto-to-fiat';

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
export const CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM = 'verification';

// Note all base routes begin with a '/'

export const RESERVED_ROUTES = new Set([
  NOT_FOUND_ROUTE,
  METACOLONY_HOME_ROUTE,
  USER_HOME_ROUTE,
  '/account',
  '/accounts',
  '/activity',
  '/activityfeed',
  '/about',
  '/admin',
  '/adminpanel',
  '/advanced',
  '/affiliate',
  '/analytics',
  '/api',
  '/app',
  '/beta',
  '/billing',
  '/blog',
  '/careers',
  '/cdapp',
  '/cdn',
  '/changelog',
  '/chat',
  '/clny',
  '/colony',
  '/colonystaff',
  '/colonyteam',
  '/community',
  '/company',
  '/complaints',
  '/conditions',
  '/config',
  '/contract',
  '/contribute',
  '/contributes',
  '/create',
  '/dao',
  '/daoclub',
  '/dapp',
  '/dashboard',
  '/data',
  '/delete',
  '/dev',
  '/developer',
  '/docs',
  '/documentation',
  '/edit',
  '/email',
  '/embed',
  '/enterprise',
  '/faq',
  '/faqs',
  '/features',
  '/feedback',
  '/file',
  '/finance',
  '/finances',
  '/forum',
  '/gateway',
  '/general',
  '/global',
  '/help',
  '/helpcenter',
  '/home',
  '/info',
  '/integrations',
  '/invalid',
  '/invest',
  '/jobs',
  '/landing',
  '/law',
  '/legal',
  '/legalnotice',
  '/login',
  '/logout',
  '/management',
  '/marketplace',
  '/media',
  '/meta',
  '/metacolony',
  '/metrics',
  '/news',
  '/notifications',
  '/onboarding',
  '/partner',
  '/payment',
  '/payments',
  '/press',
  '/pricing',
  '/privacy',
  '/privacypolicy',
  '/private',
  '/process',
  '/product',
  '/profile',
  '/profileuser',
  '/project',
  '/projects',
  '/promo',
  '/promotion',
  '/public',
  '/query',
  '/register',
  '/report',
  '/roadmap',
  '/root',
  '/sales',
  '/search',
  '/security',
  '/services',
  '/settings',
  '/shop',
  '/sitemap',
  '/staff',
  '/status',
  '/streaming',
  '/support',
  '/team',
  '/terms',
  '/test',
  '/tests',
  '/tools',
  '/tracking',
  '/transaction',
  '/transactions',
  '/translate',
  '/updates',
  '/upload',
  '/user',
  '/userpanel',
  '/verified',
  '/webhooks',
  '/welcome',
  '/whitepaper',
  '/work',
]);
