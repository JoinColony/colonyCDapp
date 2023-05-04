import { Colony } from '~types';

const minimumRequiredColonyVersion = 4;

export const canColonyBeUpgraded = (colony: Colony | undefined, contractVersion: number) =>
  colony && contractVersion > colony.version;

export const mustColonyBeUpgraded = (colony: Colony | undefined, networkVersion: number) =>
  colony && canColonyBeUpgraded(colony, networkVersion) && colony.version < minimumRequiredColonyVersion;
