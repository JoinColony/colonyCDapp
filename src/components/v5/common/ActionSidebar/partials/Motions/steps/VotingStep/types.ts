import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { MotionAction } from '~types/motions';

export interface VotingStepProps
  extends Omit<PollingControls, 'refetchAction'> {
  actionData: MotionAction;
  transactionId: string;
}

export interface VotingFormValues {
  vote: number;
}

export enum VotingStepSections {
  Vote = 'vote',
}
