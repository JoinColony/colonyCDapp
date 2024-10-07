import { type ColonyExtension } from '~types/graphql.ts';

export enum MultiSigThresholdType {
  MAJORITY_APPROVAL = 'majorityApproval',
  FIXED_THRESHOLD = 'fixedThreshold',
  INHERIT_FROM_COLONY = 'inheritFromColony',
}

export interface DomainThresholdConfig {
  type: MultiSigThresholdType;
  domainName: string;
  threshold: number;
  domainSkillId: string;
  isError?: boolean;
}

export type MultiSigParams = NonNullable<
  NonNullable<ColonyExtension['params']>['multiSig']
>;

export interface MultiSigSettingsFormValues {
  thresholdType: MultiSigThresholdType;
  globalThreshold: number;
  domainThresholds: DomainThresholdConfig[];
}
