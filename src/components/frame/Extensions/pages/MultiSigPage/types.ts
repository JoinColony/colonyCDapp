export enum MultiSigThresholdType {
  MAJORITY_APPROVAL = 'majorityApproval',
  FIXED_THRESHOLD = 'fixedThreshold',
  INHERIT_FROM_COLONY = 'inheritFromColony',
}

export interface DomainThresholdConfig {
  id: string;
  nativeSkillId: number;
  type: MultiSigThresholdType;
  name: string;
  isError?: boolean;
}
