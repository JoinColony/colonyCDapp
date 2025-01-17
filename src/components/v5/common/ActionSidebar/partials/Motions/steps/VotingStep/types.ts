import { type CompletedActionProps } from '~v5/common/CompletedAction/types.ts';

export interface VotingStepProps {
  action: CompletedActionProps['action'];
  motionData: NonNullable<CompletedActionProps['action']['motionData']>;
}

export interface VotingFormValues {
  vote: number;
}

export enum VotingStepSections {
  Vote = 'vote',
}

export enum VotingRewardsSections {
  VotingMethod = 'votingMethod',
  TeamReputation = 'teamReputation',
  RewardRange = 'rewardRange',
}
