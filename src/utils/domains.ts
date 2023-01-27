import { Id } from '@colony/colony-js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Colony } from '~types';

import { notNull } from './arrays';

export const getDomainId = (ethDomainId?: number) =>
  ethDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID || ethDomainId === undefined
    ? Id.RootDomain
    : ethDomainId;

export const getDomain = (colony: Colony, domainId: number) =>
  colony?.domains?.items
    .filter(notNull)
    .find(({ nativeId }) => nativeId === domainId);
