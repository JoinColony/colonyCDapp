import { type DomainColor } from '~gql';

export type AvailablePermission = 0 | 1 | 2 | 3 | 5 | 6;

export interface DomainWithPermissionsAndReputation {
  domainId: string;
  nativeId: number; // used for sorting
  domainName: string;
  domainColor?: DomainColor;
  reputationPercentage: number;
  reputationRaw: string;
  permissions: AvailablePermission[];
  multiSigPermissions: AvailablePermission[];
}
