import { Colony } from '~types';

export const canColonyBeUpgraded = (colony: Colony, contractVersion: number) =>
  contractVersion > colony.version;
