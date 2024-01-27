import { Colony } from '~types/graphql.ts';

const minimumRequiredColonyVersion = 4;

export const canColonyBeUpgraded = (colony: Colony, contractVersion: number) =>
  contractVersion > colony.version;

export const mustColonyBeUpgraded = (colony: Colony, networkVersion: number) =>
  canColonyBeUpgraded(colony, networkVersion) &&
  colony.version < minimumRequiredColonyVersion;
