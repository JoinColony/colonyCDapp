import { type MotionAction } from '~types/motions.ts';

export interface VotingStepProps {
  startPollingAction: () => void;
  stopPollingAction: () => void;
  actionData: MotionAction;
  transactionId: string;
  isActionCancelled?: boolean;
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
