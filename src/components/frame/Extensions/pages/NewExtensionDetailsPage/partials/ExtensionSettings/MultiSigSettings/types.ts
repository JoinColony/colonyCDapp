export enum MultiSigThresholdType {
  MAJORITY_APPROVAL = 'majorityApproval',
  FIXED_THRESHOLD = 'fixedThreshold',
  INHERIT_FROM_COLONY = 'inheritFromColony',
}

export interface DomainThresholdConfig {
  id: string;
  nativeSkillId: string;
  type: MultiSigThresholdType;
  name: string;
  isError?: boolean;
}
