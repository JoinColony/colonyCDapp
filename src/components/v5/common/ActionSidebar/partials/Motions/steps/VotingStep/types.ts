import { MotionAction } from '~types/motions.ts';

export interface VotingStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  actionData: MotionAction;
  transactionId: string;
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
