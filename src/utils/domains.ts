import { Id } from '@colony/colony-js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

export const getDomainId = (ethDomainId?: number) =>
  ethDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID || ethDomainId === undefined
    ? Id.RootDomain
    : ethDomainId;
